import { useAdminPanel } from "../../../context/adminPanelContext";

export default function AttendanceStats() {
  const { stats } = useAdminPanel();

  if (!stats?.attendances) return null;

  const { 
    totalAttendances, 
    uniqueUsersAttended, 
    activitiesWithAttendances,
    topActivities,
    topUsers
  } = stats.attendances;

  const summaryCards = [
    {
      title: "Total Asistencias",
      value: totalAttendances,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Usuarios Únicos",
      value: uniqueUsersAttended,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Actividades con Asistencias",
      value: activitiesWithAttendances,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: "from-purple-500 to-violet-600"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Estadísticas de Asistencia
      </h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div className="p-5">
              <div className="flex items-start">
                <div className={`bg-gradient-to-r ${card.color} p-3 rounded-lg text-white shadow-sm`}>
                  {card.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
            <div className={`bg-gradient-to-r ${card.color} h-1 w-full`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="bg-emerald-100 text-emerald-800 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              Top 5 Actividades
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {topActivities.map((activity, index) => (
              <div key={activity.activityId} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className={`flex-shrink-0 ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                    index === 1 ? 'bg-gray-100 text-gray-800' : 
                    index === 2 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  } text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                    #{index + 1}
                  </span>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{activity.count} asistencias</p>
                      <span className="text-xs font-medium text-emerald-600">
                        {Math.round((activity.count / totalAttendances) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              Top 5 Usuarios
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {topUsers.map((user, index) => (
              <div key={user.userId} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <span className={`flex-shrink-0 ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                    index === 1 ? 'bg-gray-100 text-gray-800' : 
                    index === 2 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  } text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                    #{index + 1}
                  </span>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{user.count} asistencias</p>
                      <span className="text-xs font-medium text-blue-600">
                        {Math.round((user.count / totalAttendances) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}