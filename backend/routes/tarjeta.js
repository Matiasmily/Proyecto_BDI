const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT v.*, 
                l.nombre_linea, 
                m.nombre_marca,
                t.descripcion AS tipo,
                u.nombre_uso AS uso,
                c.nombre_color AS color
            FROM tarjeta_circulacion.vehiculo v
            JOIN tarjeta_circulacion.linea l ON v.id_linea_fk = l.id_linea
            JOIN tarjeta_circulacion.marca m ON l.id_marca_fk = m.id_marca
            JOIN tarjeta_circulacion.tipo_vehiculo t ON v.id_tipo_fk = t.id_tipo
            JOIN tarjeta_circulacion.uso u ON v.id_uso_fk = u.id_uso
            JOIN tarjeta_circulacion.color c ON v.id_color_fk = c.id_color
        `)
        res.json(resultado.rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get('/:vin', async (req, res) => {
    try {
        const { vin } = req.params
        const resultado = await pool.query(`
            SELECT v.*, 
                l.nombre_linea, 
                m.nombre_marca,
                t.descripcion AS tipo,
                u.nombre_uso AS uso,
                c.nombre_color AS color
            FROM tarjeta_circulacion.vehiculo v
            JOIN tarjeta_circulacion.linea l ON v.id_linea_fk = l.id_linea
            JOIN tarjeta_circulacion.marca m ON l.id_marca_fk = m.id_marca
            JOIN tarjeta_circulacion.tipo_vehiculo t ON v.id_tipo_fk = t.id_tipo
            JOIN tarjeta_circulacion.uso u ON v.id_uso_fk = u.id_uso
            JOIN tarjeta_circulacion.color c ON v.id_color_fk = c.id_color
            WHERE v.vin = $1
        `, [vin])
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Vehículo no encontrado' })
        }
        res.json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { vin, placa, modelo, chasis, serie, motor, asientos, ejes, cilindros, cc, toneladas, id_linea_fk, id_tipo_fk, id_uso_fk, id_color_fk } = req.body
        const resultado = await pool.query(`
            INSERT INTO tarjeta_circulacion.vehiculo 
            (vin, placa, modelo, chasis, serie, motor, asientos, ejes, cilindros, cc, toneladas, id_linea_fk, id_tipo_fk, id_uso_fk, id_color_fk)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *
        `, [vin, placa, modelo, chasis, serie, motor, asientos, ejes, cilindros, cc, toneladas, id_linea_fk, id_tipo_fk, id_uso_fk, id_color_fk])
        res.status(201).json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.put('/:vin', async (req, res) => {
    try {
        const { vin } = req.params
        const { placa, modelo, chasis, serie, motor, asientos, ejes, cilindros, cc, toneladas, id_linea_fk, id_tipo_fk, id_uso_fk, id_color_fk } = req.body
        const resultado = await pool.query(`
            UPDATE tarjeta_circulacion.vehiculo 
            SET placa=$1, modelo=$2, chasis=$3, serie=$4, motor=$5, asientos=$6, ejes=$7, cilindros=$8, cc=$9, toneladas=$10, id_linea_fk=$11, id_tipo_fk=$12, id_uso_fk=$13, id_color_fk=$14
            WHERE vin = $15
            RETURNING *
        `, [placa, modelo, chasis, serie, motor, asientos, ejes, cilindros, cc, toneladas, id_linea_fk, id_tipo_fk, id_uso_fk, id_color_fk, vin])
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Vehículo no encontrado' })
        }
        res.json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router