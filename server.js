import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();

// 1.middlerware para procesar req.body
app.use(express.json());

// 2. pool de conexión a MySQL
const pool = mysql.createpool({
    host: process.env.DB_HOST,
    User: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    WaitForConnections: true,
    connectionLimit: 10
});

//3. Endpoint GET: Consultar consolidado de ventas con parámetro
app.get('/api/v1/ventas/consolidado', async (req, res) => {
    try {
        const {sucursal, anio} = req.query;
    
        // Validación de parámetros obligatorios
        if (!sucursal || !anio) {
            return res.status(400).json({
                error: "Bad Request",
                message: 'Debe enviar ambos parámetros'
            });


            const [rows] = await pool.query('call db_ventas_tech(?, ?)', [sucursal, anio])

            //Enviamos la respuesta al cliente
            res.status(200).json({
                message: 'Succes',
                total_registros: rows[0] ? rows[0].legth : 0,
                data: rows[0]
            })
        }
    } catch (error) {
        console.error('Error en GEt /ventas/consolidado', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})