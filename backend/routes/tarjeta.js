const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                t.no_tarjeta,
                t.codigo_identificador,
                t.valida_hasta,
                t.fecha_registro,
                t.fecha_emision,
                t.hora_emision,
                t.nit_fk,
                t.vin_fk,
                p.nombres,
                p.apellidos,
                p.cui,
                v.placa,
                v.modelo,
                l.nombre_linea,
                m.nombre_marca,
                c.nombre_color AS color,
                u.nombre_uso AS uso,
                tp.descripcion AS tipo
            FROM tarjeta_circulacion.tarjeta_circulacion t
            JOIN tarjeta_circulacion.propietario p ON t.nit_fk = p.nit
            JOIN tarjeta_circulacion.vehiculo v ON t.vin_fk = v.vin
            JOIN tarjeta_circulacion.linea l ON v.id_linea_fk = l.id_linea
            JOIN tarjeta_circulacion.marca m ON l.id_marca_fk = m.id_marca
            JOIN tarjeta_circulacion.color c ON v.id_color_fk = c.id_color
            JOIN tarjeta_circulacion.uso u ON v.id_uso_fk = u.id_uso
            JOIN tarjeta_circulacion.tipo_vehiculo tp ON v.id_tipo_fk = tp.id_tipo
        `)
        res.json(resultado.rows)
    } catch (error) {
        console.log('Error GET tarjetas:', error.message)
        res.status(500).json({ error: error.message })
    }
})

router.get('/:no_tarjeta', async (req, res) => {
    try {
        const { no_tarjeta } = req.params
        const resultado = await pool.query(`
            SELECT 
                t.no_tarjeta,
                t.codigo_identificador,
                t.valida_hasta,
                t.fecha_registro,
                t.fecha_emision,
                t.hora_emision,
                t.nit_fk,
                t.vin_fk,
                p.nombres,
                p.apellidos,
                p.cui,
                v.placa,
                v.modelo,
                l.nombre_linea,
                m.nombre_marca,
                c.nombre_color AS color,
                u.nombre_uso AS uso,
                tp.descripcion AS tipo
            FROM tarjeta_circulacion.tarjeta_circulacion t
            JOIN tarjeta_circulacion.propietario p ON t.nit_fk = p.nit
            JOIN tarjeta_circulacion.vehiculo v ON t.vin_fk = v.vin
            JOIN tarjeta_circulacion.linea l ON v.id_linea_fk = l.id_linea
            JOIN tarjeta_circulacion.marca m ON l.id_marca_fk = m.id_marca
            JOIN tarjeta_circulacion.color c ON v.id_color_fk = c.id_color
            JOIN tarjeta_circulacion.uso u ON v.id_uso_fk = u.id_uso
            JOIN tarjeta_circulacion.tipo_vehiculo tp ON v.id_tipo_fk = tp.id_tipo
            WHERE t.no_tarjeta = $1
        `, [no_tarjeta])
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Tarjeta no encontrada' })
        }
        res.json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { no_tarjeta, codigo_identificador, valida_hasta, fecha_registro, fecha_emision, hora_emision, nit_fk, vin_fk } = req.body
        console.log('Datos recibidos:', req.body)
        const resultado = await pool.query(`
            INSERT INTO tarjeta_circulacion.tarjeta_circulacion
            (no_tarjeta, codigo_identificador, valida_hasta, fecha_registro, fecha_emision, hora_emision, nit_fk, vin_fk)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [no_tarjeta, codigo_identificador, valida_hasta, fecha_registro, fecha_emision, hora_emision, nit_fk, vin_fk])
        res.status(201).json(resultado.rows[0])
    } catch (error) {
        console.log('Error al guardar tarjeta:', error.message)
        res.status(500).json({ error: error.message })
    }
})

router.put('/:no_tarjeta', async (req, res) => {
    try {
        const { no_tarjeta } = req.params
        const { valida_hasta, nit_fk, vin_fk } = req.body
        const resultado = await pool.query(`
            UPDATE tarjeta_circulacion.tarjeta_circulacion
            SET valida_hasta = $1, nit_fk = $2, vin_fk = $3
            WHERE no_tarjeta = $4
            RETURNING *
        `, [valida_hasta, nit_fk, vin_fk, no_tarjeta])
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Tarjeta no encontrada' })
        }
        res.json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router