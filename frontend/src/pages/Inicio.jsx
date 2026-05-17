import { Link } from 'react-router-dom'
import { FileText, Users, Car, BookOpen, ArrowRight } from 'lucide-react'

const tarjetas = [
  {
    to: '/tarjetas',
    icon: FileText,
    titulo: 'Tarjetas de Circulación',
    desc: 'Consultar, registrar y gestionar tarjetas de circulación.',
    color: '#429EBD',
    bg: '#EBF6FB',
  },
  {
    to: '/propietarios',
    icon: Users,
    titulo: 'Propietarios',
    desc: 'Gestionar información de los propietarios de vehículos.',
    color: '#053F5C',
    bg: '#E8F0F4',
  },
  {
    to: '/vehiculos',
    icon: Car,
    titulo: 'Vehículos',
    desc: 'Consultar y registrar vehículos en el sistema.',
    color: '#F7AD19',
    bg: '#FEF7E6',
  },
  {
    to: '/catalogos',
    icon: BookOpen,
    titulo: 'Catálogos',
    desc: 'Administrar marcas, líneas, tipos, colores y usos.',
    color: '#9FE7F5',
    bg: '#F0FBFE',
  },
]

function Inicio() {
  return (
    <div>
      {/* Banner */}
      <div className="rounded-2xl p-8 mb-8 flex items-center justify-between"
        style={{ backgroundColor: '#053F5C' }}>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Bienvenido al Sistema 
          </h2>
          <p style={{ color: '#9FE7F5' }} className="text-sm">
            Gestión de tarjetas de circulación vehicular
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: '#F7AD19' }}>
          <Car size={32} color="#053F5C" />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-5">
        {tarjetas.map(({ to, icon: Icon, titulo, desc, color, bg }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: bg }}>
              <Icon size={22} style={{ color }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-1" style={{ color: '#053F5C' }}>{titulo}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-gray-400 transition mt-1" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Inicio