'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatDateTime, formatCncTaskStatus, formatCncOperation } from '@/lib/utils';

interface CncTask {
  id: string;
  title: string;
  operation?: string;
  machineName?: string;
  scheduledAt: string;
  status: string;
}

export default function CncTasksPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<CncTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.cncTasks
      .list(token)
      .then((data) => setTasks((data as { data: CncTask[] }).data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">CNC Görevleri</h1>
          <p className="text-muted-foreground">Kesim, cila, kenar işleme ve köprü CNC planları</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {!loading && !error && tasks.length === 0 && (
          <EmptyState title="CNC görevi yok" description="CNC iş planı ekleyin." />
        )}
        {!loading && !error && tasks.length > 0 && (
          <Card className="sp-brutal-card shadow-none">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">Görev</th>
                      <th className="pb-2">Operasyon</th>
                      <th className="pb-2">Makine</th>
                      <th className="pb-2">Planlanan</th>
                      <th className="pb-2">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-b border-border/50">
                        <td className="py-2 font-medium">{task.title}</td>
                        <td className="py-2 text-muted-foreground">
                          {formatCncOperation(task.operation || 'other')}
                        </td>
                        <td className="py-2">{task.machineName || '—'}</td>
                        <td className="py-2">{formatDateTime(task.scheduledAt)}</td>
                        <td className="py-2">
                          <Badge variant="secondary">{formatCncTaskStatus(task.status)}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
