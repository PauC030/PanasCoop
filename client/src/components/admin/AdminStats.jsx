export default function AdminStats({ stats }) {
  if (!stats) return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-pulse text-gray-500">Cargando estadísticas...</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Panel de Estadísticas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta Super Administradores */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Super Admins</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalSuperAdmins}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Acceso completo al sistema</p>
        </div>

        {/* Tarjeta Administradores */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Administradores</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalAdmins}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Acceso administrativo limitado</p>
        </div>

        {/* Tarjeta Usuarios */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Usuarios</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Usuarios registrados</p>
        </div>
      </div>

      {/* Tarjeta Total de Cuentas */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-blue-100 uppercase tracking-wider">Total de Cuentas</h3>
            <p className="mt-2 text-4xl font-bold text-white">{stats.totalAccounts}</p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-full">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="bg-white bg-opacity-30 text-xs px-2 py-1 rounded-full text-white">Todos los roles</span>
          <span className="ml-2 text-xs text-blue-100">Actualizado en tiempo real</span>
        </div>
      </div>
    </div>
  );
}