const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM tarjeta_circulacion.tipo_vehiculo')
        res.json(resultado.rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { descripcion } = req.body
        const resultado = await pool.query(
            'INSERT INTO tarjeta_circulacion.tipo_vehiculo (descripcion) VALUES ($1) RETURNING *',
            [descripcion]
        )
        res.status(201).json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router