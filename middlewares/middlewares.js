export const reportQuery = async (req, res, next) => {
    const queryParams = req.query
    const url = req.url
    console.log(`
    Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url} 
    con los queries:
    `, queryParams)
    next() 
}

export const reportParams = async (req, res, next) => {
    const parameters = req.params
    const url = req.url
    console.log(`
    Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url} 
    con los parámetros:
    `, parameters)
    next() 
}