import { pool } from "../database/connection.js"
import format from "pg-format";

const findAll = async (sort, limit, page) => {
    let query = "SELECT * FROM inventario";
    const arrayValues = [];

    if (sort) {
        console.log(sort)
        query += " ORDER BY %s %s";
        arrayValues.push(Object.keys(sort)[0], sort[Object.keys(sort)[0]]);
    }

    if (limit) {
        query += " LIMIT %s";
        arrayValues.push(limit);
    }

    if (page) {
        query += " OFFSET %s";
        arrayValues.push((page - 1) * limit);
    }

    try {
        const finalQuery = format(query, ...arrayValues);
        console.log(query)
        const result = await pool.query(finalQuery);
        console.log("Joyas encontradas: ", result.rowCount)
        console.log("Información encontrada: ", result.rows)
        return result.rows;
    } catch (error) {
        console.log(error)
        throw error
    }
}

const getCount = async () => {
    try {
        const query = "SELECT COUNT(*) AS total FROM inventario"
        const result = await pool.query(query)
        return result.rows[0].total
    } catch (error) {
        throw error
    }
}

const findById = async (id) => {
    try {
        const query = "SELECT * FROM inventario WHERE id =$1"
        const result = await pool.query(query, [id])
        console.log("Joyas encontradas: ", result.rowCount)
        console.log("Información encontrada: ", result.rows[0])
        return result
    } catch (error) {
        throw error
    }
}

const filter = async ({ precio_max, precio_min, categoria, metal }) => {
    let filters = []
    let values = []
    let query = "SELECT * FROM inventario"

    const addFilter = (field, comparator, value) => {
        values.push(value)
        const { length } = filters
        filters.push(`${field} ${comparator} $${length + 1}`)
    }

    if (precio_max) addFilter('precio', '<=', precio_max)
    if (precio_min) addFilter('precio', '>=', precio_min)
    if (categoria) addFilter('categoria', '=', categoria.toLowerCase())
    if (metal) addFilter('metal', '=', metal.toLowerCase())

    if (filters.length > 0) {
        filters = filters.join(" AND ")
        query += ` WHERE ${filters}`
    }

    try {
        console.log(query)
        const result = await pool.query(query, values)
        console.log("Joyas encontradas: ", result.rowCount)
        console.log("Información encontrada: ", result.rows)
        return result.rows
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const jewelModel = {
    findAll,
    findById,
    filter,
    getCount,
}