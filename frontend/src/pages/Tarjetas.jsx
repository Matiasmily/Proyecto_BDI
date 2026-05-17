import { useState, useEffect } from 'react'
import axios from 'axios'
import { FileText, Calendar, Car, User, Plus, X, Search } from 'lucide-react'

function generarNoTarjeta() {
  const fecha = new Date()
  const anio = fecha.getFullYear()
  const aleatorio = Math.floor(Math.random() * 9000000) + 1000000
  return `${anio}${aleatorio}`
}

function generarCodigoIdentificador() {
  const anio = new Date().getFullYear()
  const aleatorio = Math.floor(Math.random() * 900000) + 100000
  return `${anio}-${aleatorio}-${Math.floor(Math.random() * 9)}`
}

function Tarjetas() {
  const [tarjetas, setTarjetas] = useState([])
  const [propietarios, setPropietarios] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState({
    no_tarjeta: '',
    codigo_identificador: '',
    valida_hasta: '',
    fecha_registro: '',
    fecha_emision: '',
    hora_emision: '',
    nit_fk: '',
    vin_fk: ''
  })

  useEffect(() => {
    cargarTodo()
  }, [])

  const cargarTodo = async () => {
    const [t, p, v] = await Promise.all([
      axios.get('http://localhost:3000/api/tarjetas'),
      axios.get('http://localhost:3000/api/propietarios'),
      axios.get('http://localhost:3000/api/vehiculos'),
    ])
    setTarjetas(t.data)
    setPropietarios(p.data)
    setVehiculos(v.data)
  }

  const abrirFormulario = () => {
    const ahora = new Date()
    const fecha = ahora.toISOString().split('T')[0]
    const hora = ahora.toTimeString().slice(0, 5)
    setForm({
      no_tarjeta: generarNoTarjeta(),
      codigo_identificador: generarCodigoIdentificador(),
      valida_hasta: '',
      fecha_registro: '',
      fecha_emision: fecha,
      hora_emision: hora,
      nit_fk: '',
      vin_fk: ''
    })
    setMostrarFormulario(true)
  }

  const guardar = async () => {
    try {
      await axios.post('http://localhost:3000/api/tarjetas', form)
      setMostrarFormulario(false)
      cargarTodo()
    } catch (error) {
      console.error(error)
      alert('Error al guardar la tarjeta')
    }
  }

  const tarjetasFiltradas = tarjetas.filter(t =>
    t.no_tarjeta?.includes(busqueda) ||
    t.nombres?.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.apellidos?.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.placa?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#053F5C' }}>Tarjetas de Circulación</h2>
          <p className="text-sm text-gray-400">{tarjetas.length} tarjetas registradas</p>
        </div>
        <button
          onClick={abrirFormulario}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition"
          style={{ backgroundColor: '#053F5C' }}
        >
          <Plus size={16} />
          Nueva Tarjeta
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold" style={{ color: '#053F5C' }}>Nueva Tarjeta de Circulación</h3>
            <button onClick={() => setMostrarFormulario(false)}>
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          {/* Campos automáticos */}
          <div className="rounded-xl p-4 mb-5 grid grid-cols-2 gap-3" style={{ backgroundColor: '#EBF6FB' }}>
            <div>
              <p className="text-xs text-gray-400 mb-1">No. Tarjeta (automático)</p>
              <p className="font-mono font-bold text-sm" style={{ color: '#053F5C' }}>{form.no_tarjeta}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Código Identificador (automático)</p>
              <p className="font-mono font-bold text-sm" style={{ color: '#053F5C' }}>{form.codigo_identificador}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Fecha Emisión (automático)</p>
              <p className="font-mono font-bold text-sm" style={{ color: '#053F5C' }}>{form.fecha_emision}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Hora Emisión (automático)</p>
              <p className="font-mono font-bold text-sm" style={{ color: '#053F5C' }}>{form.hora_emision}</p>
            </div>
          </div>

          {/* Campos manuales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Propietario</label>
              <select
                className="border border-gray-200 rounded-xl px-3 py-2 w-full text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#429EBD' }}
                value={form.nit_fk}
                onChange={e => setForm({ ...form, nit_fk: e.target.value })}
              >
                <option value="">Selecciona propietario</option>
                {propietarios.map(p => (
                  <option key={p.nit} value={p.nit}>{p.nombres} {p.apellidos} — {p.nit}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Vehículo</label>
              <select
                className="border border-gray-200 rounded-xl px-3 py-2 w-full text-sm focus:outline-none focus:ring-2"
                value={form.vin_fk}
                onChange={e => setForm({ ...form, vin_fk: e.target.value })}
              >
                <option value="">Selecciona vehículo</option>
                {vehiculos.map(v => (
                  <option key={v.vin} value={v.vin}>{v.placa} — {v.nombre_marca} {v.nombre_linea}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Registro</label>
              <input
                type="date"
                className="border border-gray-200 rounded-xl px-3 py-2 w-full text-sm focus:outline-none focus:ring-2"
                value={form.fecha_registro}
                onChange={e => setForm({ ...form, fecha_registro: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Válida Hasta</label>
              <input
                type="date"
                className="border border-gray-200 rounded-xl px-3 py-2 w-full text-sm focus:outline-none focus:ring-2"
                value={form.valida_hasta}
                onChange={e => setForm({ ...form, valida_hasta: e.target.value })}
              />
            </div>
          </div>

          <button
            onClick={guardar}
            className="mt-5 px-6 py-2 rounded-xl text-white text-sm font-medium transition"
            style={{ backgroundColor: '#429EBD' }}
          >
            Guardar Tarjeta
          </button>
        </div>
      )}

      {/* Buscador */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="border border-gray-200 rounded-xl pl-9 pr-4 py-2 w-full text-sm focus:outline-none focus:ring-2 bg-white"
          placeholder="Buscar por número de tarjeta, propietario o placa..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Cards de tarjetas */}
      {tarjetasFiltradas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p>No hay tarjetas registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {tarjetasFiltradas.map(t => {
            const vencida = new Date(t.valida_hasta) < new Date()
            return (
              <div key={t.no_tarjeta} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                {/* Header card */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">No. Tarjeta</p>
                    <p className="font-mono font-bold text-sm" style={{ color: '#053F5C' }}>{t.no_tarjeta}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${vencida ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {vencida ? 'Vencida' : 'Vigente'}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mb-4" />

                {/* Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <User size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#429EBD' }} />
                    <div>
                      <p className="text-xs text-gray-400">Propietario</p>
                      <p className="text-sm font-medium text-gray-700">{t.nombres} {t.apellidos}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Car size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#429EBD' }} />
                    <div>
                      <p className="text-xs text-gray-400">Vehículo</p>
                      <p className="text-sm font-medium text-gray-700">{t.nombre_marca} {t.nombre_linea}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FileText size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#429EBD' }} />
                    <div>
                      <p className="text-xs text-gray-400">Placa</p>
                      <p className="text-sm font-medium text-gray-700">{t.placa}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#429EBD' }} />
                    <div>
                      <p className="text-xs text-gray-400">Válida hasta</p>
                      <p className="text-sm font-medium text-gray-700">
                        {t.valida_hasta ? new Date(t.valida_hasta).toLocaleDateString() : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer card */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                  <p className="text-xs text-gray-400">Código: <span className="font-mono">{t.codigo_identificador}</span></p>
                  <p className="text-xs text-gray-400">Tipo: {t.tipo}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Tarjetas