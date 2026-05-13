const express = require('express')
const router = express.Router()
const pool = require('../db')

// Obtener todos los propietarios
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM tarjeta_circulacion.propietario')
        res.json(resultado.rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Obtener un propietario por NIT
router.get('/:nit', async (req, res) => {
    try {
        const { nit } = req.params
        const resultado = await pool.query(
            'SELECT * FROM tarjeta_circulacion.propietario WHERE nit = $1',
            [nit]
        )
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Propietario no encontrado' })
        }
        res.json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Crear propietario
router.post('/', async (req, res) => {
    try {
        const { nit, cui, nombres, apellidos } = req.body
        const resultado = await pool.query(
            'INSERT INTO tarjeta_circulacion.propietario (nit, cui, nombres, apellidos) VALUES ($1, $2, $3, $4) RETURNING *',
            [nit, cui, nombres, apellidos]
        )
        res.status(201).json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Actualizar propietario
router.put('/:nit', async (req, res) => {
    try {
        const { nit } = req.params
        const { cui, nombres, apellidos } = req.body
        const resultado = await pool.query(
            'UPDATE tarjeta_circulacion.propietario SET cui = $1, nombres = $2, apellidos = $3 WHERE nit = $4 RETURNING *',
            [cui, nombres, apellidos, nit]
        )
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Propietario no encontrado' })
        }
        res.json(resultado.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router