const { Pool } = require("pg")
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "1234",
    port: 5432,
    database: "gym_db"
})
const consultarNombre = async (nombre) => {
    // Paso 2
    try {
        const result = await pool.query(
            `SELECT * FROM ejercicios WHERE nombre = '${nombre}'`
        );
        return result.rows[0];
    } catch (error) {
        console.log(error.code);
        return error;
    }
}

const insertar = async (datos) => {
    const nombreConsultado = await consultarNombre(datos[0])
    if (nombreConsultado === undefined) {
        const consulta = {
            text: "INSERT INTO ejercicios values($1, $2, $3, $4) RETURNING *",
            values: datos,
        }
        try {
            const result = await pool.query(consulta)
            return result.rows[0];
        } catch (error) {
            console.log(error.code)
            return error
        }
    } else {
        return undefined
    }


}
const consultar = async () => {
    // Paso 2
    try {
        const result = await pool.query("SELECT * FROM ejercicios")
        return result.rows
    } catch (error) {
        // Paso 3
        console.log(error.code)
        return error
    }
}
const editar = async (datos) => {
    // Paso 2
    const consulta = {
        text: `UPDATE ejercicios SET
    nombre = $1,
    series = $2,
    repeticiones = $3,
    descanso = $4
    WHERE nombre = $1 RETURNING *`,
        values: datos,
    };
    // Paso 3
    try {
        const result = await pool.query(consulta);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }


}

const eliminar = async (nombre) => {
    // Paso 2
    try {
        const result = await pool.query(
            `DELETE FROM ejercicios WHERE nombre = '${nombre}'`
        );
        return result;
    } catch (error) {
        console.log(error.code);
        return error;
    }
}



module.exports = { insertar, consultar, editar, eliminar, consultarNombre }