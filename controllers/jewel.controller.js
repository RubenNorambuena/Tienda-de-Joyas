import { jewelModel } from "../models/jewel.model.js";
import { handleErrors } from "../database/errors.js";

const prepareHATEOAS = async (jewels, limit, page) => {
    const totalStock = jewels.reduce((acc, { stock }) => acc + stock, 0);
    const results = jewels.map(({ nombre, id }) => ({
        name: nombre,
        href: `/api/joyas/${id}`,
    }));

    const totalMeta = await jewelModel.getCount();
    const totalPages = Math.ceil(totalMeta / limit);

    const meta = {
        total: totalMeta,
        limit: parseInt(limit, 10),
        page: parseInt(page, 10),
        total_pages: totalPages,
        next: totalPages <= page ? null : `http://localhost:3000/api/joyas?limit=${limit}&page=${parseInt(page, 10) + 1}`,
        previous: page <= 1 ? null : `http://localhost:3000/api/joyas?limit=${limit}&page=${parseInt(page, 10) - 1}`,
    };

    return { total: jewels.length, totalStock, results, meta };
};

const getAllJewels = async (req, res) => {
    const { sort, limit = 20, page = 1 } = req.query;
    try {
        const result = await jewelModel.findAll(sort, limit, page);
        const HATEOAS = await prepareHATEOAS(result, limit, page);
        res.json(HATEOAS);
    } catch (error) {
        console.error(error);
        const { status, message } = handleErrors(error.code);
        res.status(status).json({ ok: false, result: message });
    }
};

const getJewelById = async (req, res) => {
    const { id } = req.params;
    if (!id.trim()) {
        const { status, message } = handleErrors("402");
        return res.status(status).json({ ok: false, result: message });
    }

    try {
        const result = await jewelModel.findById(id);
        if (result.rows.length === 0) {
            const { status, message } = handleErrors("403");
            return res.status(status).json({ ok: false, result: message });
        }
        res.json({ ok: true, result: result.rows[0] });
    } catch (error) {
        console.error(error);
        const { status, message } = handleErrors(error.code);
        res.status(status).json({ ok: false, result: message });
    }
};

const filterJewel = async (req, res) => {
    const { precio_max, precio_min, categoria, metal } = req.query;
    try {
        const result = await jewelModel.filter({ precio_max, precio_min, categoria, metal });
        if (result.length === 0) {
            const { status, message } = handleErrors("404");
            return res.status(status).json({ ok: false, result: message });
        }
        res.json(result);
    } catch (error) {
        console.error(error);
        const { status, message } = handleErrors(error.code);
        res.status(status).json({ ok: false, result: message });
    }
};

export const jewelController = {
    getAllJewels,
    getJewelById,
    filterJewel,
};
