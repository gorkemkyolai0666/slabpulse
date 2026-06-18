'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatCurrency, formatFinishStatus, formatFinishCategory } from '@/lib/utils';

interface Finish {
  id: string;
  title: string;
  finishCategory: string;
  pricePerSqm: number;
  leadDays?: number;
  status: string;
}

export default function FinishesPage() {
  const { token } = useAuth();
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.finishes
      .list(token)
      .then((data) => setFinishes((data as { data: Finish[] }).data))
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
          <h1 className="font-display text-3xl font-bold uppercase">Yüzey İşleme</h1>
          <p className="text-muted-foreground">Parlatma, honlama ve özel yüzey işleme kataloğu</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {!loading && !error && finishes.length === 0 && (
          <EmptyState title="Yüzey işleme kaydı yok" description="Yüzey işleme hizmeti tanımlayın." />
        )}
        {!loading && !error && finishes.length > 0 && (
          <Card className="sp-brutal-card shadow-none">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">Hizmet</th>
                      <th className="pb-2">Kategori</th>
                      <th className="pb-2">Birim Fiyat</th>
                      <th className="pb-2">Teslim (gün)</th>
                      <th className="pb-2">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finishes.map((finish) => (
                      <tr key={finish.id} className="border-b border-border/50">
                        <td className="py-2 font-medium">{finish.title}</td>
                        <td className="py-2 text-muted-foreground">
                          {formatFinishCategory(finish.finishCategory)}
                        </td>
                        <td className="py-2">{formatCurrency(finish.pricePerSqm)}</td>
                        <td className="py-2">{finish.leadDays ?? '—'}</td>
                        <td className="py-2">
                          <Badge variant="secondary">{formatFinishStatus(finish.status)}</Badge>
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
