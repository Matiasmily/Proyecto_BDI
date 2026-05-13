const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./db')

// Prueba de conexión
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log('Error conectando a la BD:', err.message)
    } else {
        console.log('Conexión a Supabase exitosa:', res.rows[0].now)
    }
})

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
const propietarioRoutes = require('./routes/propietario')
const marcaRoutes = require('./routes/marca')
const lineaRoutes = require('./routes/linea')
const tipoVehiculoRoutes = require('./routes/tipo_vehiculo')
const colorRoutes = require('./routes/color')
const usoRoutes = require('./routes/uso')
const vehiculoRoutes = require('./routes/vehiculo')
const tarjetaRoutes = require('./routes/tarjeta')
app.use('/api/propietarios', propietarioRoutes)
app.use('/api/marcas', marcaRoutes)
app.use('/api/lineas', lineaRoutes)
app.use('/api/tipos', tipoVehiculoRoutes)
app.use('/api/colores', colorRoutes)
app.use('/api/usos', usoRoutes)
app.use('/api/vehiculos', vehiculoRoutes)
app.use('/api/tarjetas', tarjetaRoutes)

app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor corriendo correctamente' })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})