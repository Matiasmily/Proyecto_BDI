const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM tarjeta_circulacion.uso')
        res.json(resultado.rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { nombre_uso } = req.body
        const resultado = await pool.query(
            'INSERT INTO tarjeta_circulacion.uso (nombre_uso) VALUES ($1) RETURNING *',
            [nombre_uso]
        )
        res.status(201).json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router