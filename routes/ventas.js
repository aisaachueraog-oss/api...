import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET: Consultar consolidado de ventas
router.get('/consolidado', async (req, res) => {
    try {
        const { sucursal, anio } = req.query;

        // Validar parámetros
        if (!sucursal || !anio) {
            return res.status(400).json({
                error: 'Bad request',
                message: 'Debe enviar ambos parámetros'
            });
        }

        // Ejecutar procedimiento almacenado
        const [rows] = await pool.query(
            'CALL db_ventas_tech(?, ?)',
            [sucursal, anio]
        );

        // Enviar respuesta
        res.status(200).json({
            status: 'success',
            total_registros: rows[0] ? rows[0].length : 0,
            data: rows[0]
        });

    } catch (error) {
        console.log('Error en GET /ventas/consolidado:', error);

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Error en MySQL'
        });
    }
});

// POST: Ingresar una nueva venta
router.post('/', async (req, res) => {
    try {
        const {
            id_producto,
            id_cliente,
            cantidad,
            fecha_venta
        } = req.body;

        // Validar datos
        if (
            id_producto == null ||
            id_cliente == null ||
            cantidad == null ||
            !fecha_venta
        ) {
            return res.status(400).json({
                error: 'Bad request',
                message: 'Todos los parámetros son obligatorios'
            });
        }

        // Registrar venta en la base de datos
        await pool.query(
            'CALL db_registrar_venta(?, ?, ?, ?)',
            [
                id_producto,
                id_cliente,
                cantidad,
                fecha_venta
            ]
        );

        // Respuesta de éxito
        res.status(201).json({
            status: 'created',
            message: 'Venta registrada exitosamente',
            datos_registrados: {
                id_producto,
                id_cliente,
                cantidad,
                fecha_venta
            }
        });

    } catch (error) {
        console.log('Error en POST /ventas:', error);

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Error en MySQL'
        });
    }
});

export default router;