import { useState, useEffect } from 'react'
import axios from 'axios'
import { FileText, Calendar, Car, User, Plus, X, Search, Pencil, PowerOff} from 'lucide-react'

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
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null)
  const [nuevoPropietario, setNuevoPropietario] = useState('')
  const [tarjetaDesactivar, setTarjetaDesactivar] = useState(null)
  const [motivoDesactivacion, setMotivoDesactivacion] = useState('')
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
  try {
    const [t, p, v] = await Promise.all([
      axios.get('http://localhost:3000/api/tarjetas'),
      axios.get('http://localhost:3000/api/propietarios'),
      axios.get('http://localhost:3000/api/vehiculos'),
    ])
    
    console.log("Tarjetas recibidas:", t.data) 
    
    setTarjetas(t.data)
    setPropietarios(p.data)
    setVehiculos(v.data)
  } catch (error) {
    console.error("Error cargando datos:", error)
  }
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
  
  const cambiarDueno = async () => {
  try {
    await axios.put(`http://localhost:3000/api/tarjetas/${tarjetaSeleccionada.no_tarjeta}`, {
      valida_hasta: tarjetaSeleccionada.valida_hasta,
      nit_fk: nuevoPropietario,
      vin_fk: tarjetaSeleccionada.vin_fk
    })
    setTarjetaSeleccionada(null)
    setNuevoPropietario('')
    cargarTodo()
  } catch (error) {
    console.error(error)
    alert('Error al cambiar el dueño')
  }
}

const desactivarTarjeta = async () => {
  try {
    await axios.patch(`http://localhost:3000/api/tarjetas/${tarjetaDesactivar.no_tarjeta}/desactivar`, {
      motivo: motivoDesactivacion
    })
    
    setTarjetaDesactivar(null)
    setMotivoDesactivacion('')
    cargarTodo()          
  } catch (error) {
    console.error(error)
    alert('Error al desactivar la tarjeta')
  }
}

const activarTarjeta = async (no_tarjeta) => {
  try {
    await axios.patch(`http://localhost:3000/api/tarjetas/${no_tarjeta}/activar`)
    cargarTodo()
  } catch (error) {
    console.error(error)
    alert('Error al activar la tarjeta')
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

      {/* Modal cambiar dueño */}
{tarjetaSeleccionada && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold" style={{ color: '#053F5C' }}>Cambiar Propietario</h3>
        <button onClick={() => setTarjetaSeleccionada(null)}>
          <X size={18} className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: '#EBF6FB' }}>
        <p className="text-xs text-gray-400 mb-1">Tarjeta</p>
        <p className="font-mono font-bold text-sm" style={{ color: '#053F5C' }}>{tarjetaSeleccionada.no_tarjeta}</p>
        <p className="text-xs text-gray-400 mt-2 mb-1">Propietario actual</p>
        <p className="text-sm font-medium" style={{ color: '#053F5C' }}>{tarjetaSeleccionada.nombres} {tarjetaSeleccionada.apellidos}</p>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-600 mb-1">Nuevo propietario</label>
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 w-full text-sm focus:outline-none focus:ring-2"
          value={nuevoPropietario}
          onChange={e => setNuevoPropietario(e.target.value)}
        >
          <option value="">Selecciona propietario</option>
          {propietarios.map(p => (
            <option key={p.nit} value={p.nit}>{p.nombres} {p.apellidos} — {p.nit}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setTarjetaSeleccionada(null)}
          className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={cambiarDueno}
          className="flex-1 px-4 py-2 rounded-xl text-white text-sm font-medium"
          style={{ backgroundColor: '#429EBD' }}
        >
          Confirmar cambio
        </button>
      </div>
    </div>
  </div>
)}

      {/* Modal desactivar tarjeta */}
{tarjetaDesactivar && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-red-600">Desactivar Tarjeta</h3>
        <button onClick={() => setTarjetaDesactivar(null)}>
          <X size={18} className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: '#FEF2F2' }}>
        <p className="text-xs text-gray-400 mb-1">Tarjeta</p>
        <p className="font-mono font-bold text-sm text-red-700">{tarjetaDesactivar.no_tarjeta}</p>
        <p className="text-xs text-gray-400 mt-2 mb-1">Propietario</p>
        <p className="text-sm font-medium text-red-700">{tarjetaDesactivar.nombres} {tarjetaDesactivar.apellidos}</p>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-600 mb-1">Motivo de desactivación</label>
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 w-full text-sm focus:outline-none focus:ring-2"
          value={motivoDesactivacion}
          onChange={e => setMotivoDesactivacion(e.target.value)}
        >
          <option value="">Selecciona motivo</option>
          <option value="impago">Impago</option>
          <option value="vencimiento">Vencimiento</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setTarjetaDesactivar(null)}
          className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={desactivarTarjeta}
          className="flex-1 px-4 py-2 rounded-xl text-white text-sm font-medium bg-red-500 hover:bg-red-600 transition"
        >
          Desactivar
        </button>
      </div>
    </div>
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
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    t.activa === false ? 'bg-gray-100 text-gray-500' :
                    vencida ? 'bg-red-100 text-red-600' : 
                    'bg-green-100 text-green-600'
                  }`}>
                     {t.activa === false ? 'Inactiva' : vencida ? 'Vencida' : 'Vigente'}
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

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-xs text-gray-400">Código: <span className="font-mono">{t.codigo_identificador}</span></p>
                  <p className="text-xs text-gray-400">Tipo: {t.tipo}</p>
                  <div className="flex items-center gap-3">
                    {t.activa !== false ? (
                       <button
                         onClick={() => setTarjetaDesactivar(t)}
                         className="flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-600 transition"
                       >
                         <PowerOff size={12} />
                         Desactivar
                       </button>
                      ) : (
                       <button
                         onClick={() => activarTarjeta(t.no_tarjeta)}
                         className="flex items-center gap-1 text-xs font-medium text-green-500 hover:text-green-700 transition"
                       >
                         <PowerOff size={12} />
                         Activar
                       </button>
                      )}
                    <button
                      onClick={() => { setTarjetaSeleccionada(t); setNuevoPropietario('') }}
                      className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition"
                      style={{ color: '#429EBD' }}
                    >
                      <Pencil size={12} />
                      Cambiar dueño
                    </button>
                </div>
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