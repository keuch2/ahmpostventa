import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/admin.service';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { formatNumber } from '../../utils/formatters';

const kpiCards = [
  { key: 'campanias_activas', label: 'Campanias Activas', icon: 'fa-bullhorn', bg: 'bg-blue-50', text: 'text-blue-600' },
  { key: 'recalls_pendientes', label: 'Recalls Pendientes', icon: 'fa-triangle-exclamation', bg: 'bg-yellow-50', text: 'text-yellow-600' },
  { key: 'citas_hoy', label: 'Citas Hoy', icon: 'fa-calendar-check', bg: 'bg-green-50', text: 'text-green-600' },
  { key: 'citas_semana', label: 'Citas Semana', icon: 'fa-calendar-week', bg: 'bg-purple-50', text: 'text-purple-600' },
];

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.dashboard().then((r) => r.data),
  });

  if (isLoading) return <Spinner />;

  const stats = data?.stats ?? {};
  const campanias = data?.ultimas_campanias ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Vista general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((kpi) => (
          <Card key={kpi.key} className="p-5">
            <div className="flex items-center gap-4">
              <div className={`${kpi.bg} rounded-sm p-3 flex items-center justify-center`}>
                <i className={`fa-solid ${kpi.icon} ${kpi.text} text-lg`}></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats[kpi.key])}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{kpi.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-0">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">Ultimas campanias</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Registro</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Tipo</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Fecha</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Vehiculos</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">Pendientes</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-4 py-3">% Cumplimiento</th>
              </tr>
            </thead>
            <tbody>
              {campanias.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-12">
                    No hay campanias registradas.
                  </td>
                </tr>
              ) : (
                campanias.map((c) => {
                  const total = c.vehiculos_count ?? 0;
                  const pendientes = c.pendientes_count ?? 0;
                  const pct = total > 0 ? Math.round(((total - pendientes) / total) * 100) : 0;
                  const barColor = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';

                  return (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 font-medium">{c.registro_campania}</td>
                      <td className="px-4 py-3 text-gray-700">{c.tipo}</td>
                      <td className="px-4 py-3 text-gray-700">{c.fecha}</td>
                      <td className="px-4 py-3 text-gray-700">{formatNumber(total)}</td>
                      <td className="px-4 py-3 text-gray-700">{formatNumber(pendientes)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                            <div className={`${barColor} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-gray-600">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
