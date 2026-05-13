const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT l.*, m.nombre_marca 
            FROM tarjeta_circulacion.linea l
            JOIN tarjeta_circulacion.marca m ON l.id_marca_fk = m.id_marca
        `)
        res.json(resultado.rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { nombre_linea, id_marca_fk } = req.body
        const resultado = await pool.query(
            'INSERT INTO tarjeta_circulacion.linea (nombre_linea, id_marca_fk) VALUES ($1, $2) RETURNING *',
            [nombre_linea, id_marca_fk]
        )
        res.status(201).json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router