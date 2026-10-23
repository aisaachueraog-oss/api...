import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// 1. RUTA GET: Consultar todos los productos
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');

        res.status(200).json({
            status: 'success',
            total_registros: rows.length,
            data: rows
        });
    } catch (error) {
        console.log('Error en GET /productos:', error);

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Error en MySQL'
        });
    }
});

// 2. RUTA POST: Guardar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const {
            id_categoria,
            nombre_producto,
            precio_unitario,
            costo_proveedor,
            ubicacion_pasillo
        } = req.body;

        // Validar datos obligatorios
        if (
            id_categoria == null ||
            !nombre_producto ||
            precio_unitario == null ||
            costo_proveedor == null ||
            !ubicacion_pasillo
        ) {
            return res.status(400).json({
                error: 'Bad request',
                message: 'Todos los parámetros son obligatorios'
            });
        }

        // Insertar producto en la base de datos
        const [result] = await pool.query(
            `INSERT INTO productos (id_categoria, nombre_producto, precio_unitario, costo_proveedor, ubicacion_pasillo) 
             VALUES (?, ?, ?, ?, ?)`,
            [id_categoria, nombre_producto, precio_unitario, costo_proveedor, ubicacion_pasillo]
        );

        res.status(201).json({
            status: 'created',
            message: 'Producto creado exitosamente',
            id_producto: result.insertId,
            datos_registrados: {
                id_categoria,
                nombre_producto,
                precio_unitario,
                costo_proveedor,
                ubicacion_pasillo
            }
        });

    } catch (error) {
        console.log('Error en POST /productos:', error);

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Error en MySQL'
        });
    }
});

export default router;