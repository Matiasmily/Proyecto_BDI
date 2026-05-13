const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM tarjeta_circulacion.marca')
        res.json(resultado.rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { nombre_marca } = req.body
        const resultado = await pool.query(
            'INSERT INTO tarjeta_circulacion.marca (nombre_marca) VALUES ($1) RETURNING *',
            [nombre_marca]
        )
        res.status(201).json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { nombre_marca } = req.body
        const resultado = await pool.query(
            'UPDATE tarjeta_circulacion.marca SET nombre_marca = $1 WHERE id_marca = $2 RETURNING *',
            [nombre_marca, id]
        )
        res.json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router