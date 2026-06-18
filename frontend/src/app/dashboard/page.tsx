'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatDate,
  formatPercent,
  formatAreaSqm,
  formatSurveyStatus,
  formatSurveyQuality,
} from '@/lib/utils';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  projectThroughputRate: number;
  totalSlabs: number;
  approvedSurveys: number;
  pendingRevisions: number;
  pendingCncTasks: number;
  slabArea: number;
  recentSurveys: Array<{
    id: string;
    surveyedAt: string;
    status: string;
    surveyQuality: string;
    project?: { projectNumber: string; clientName: string };
  }>;
  machines: Array<{ machineName: string | null; projectCount: number }>;
  monthlyTrend: Array<{ month: string; siteSurveys: number; revisions: number }>;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.dashboard
      .stats(token)
      .then((data) => setStats(data as DashboardStats))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl tracking-wide">Operasyon Paneli</h1>
          <p className="mt-1 text-muted-foreground">Proje, levha stok ve saha ölçüm özeti</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={loadStats} />}
        {stats && !loading && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sp-stat">
                <p className="text-xs uppercase text-muted-foreground">Proje Verimi</p>
                <p className="font-display text-4xl text-primary">{formatPercent(stats.projectThroughputRate)}</p>
                <p className="text-sm text-muted-foreground">
                  {stats.activeProjects}/{stats.totalProjects} proje aktif
                </p>
              </div>
              <div className="sp-stat">
                <p className="text-xs uppercase text-muted-foreground">Levha Stok</p>
                <p className="font-display text-4xl">{stats.totalSlabs}</p>
                <p className="text-sm text-muted-foreground">{formatAreaSqm(stats.slabArea)} toplam</p>
              </div>
              <div className="sp-stat">
                <p className="text-xs uppercase text-muted-foreground">Ölçüm & CNC</p>
                <p className="font-display text-4xl">{stats.pendingRevisions}</p>
                <p className="text-sm text-muted-foreground">{stats.pendingCncTasks} bekleyen CNC görevi</p>
              </div>
              <div className="sp-stat">
                <p className="text-xs uppercase text-muted-foreground">Onaylı Ölçüm</p>
                <p className="font-display text-4xl">{stats.approvedSurveys}</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="sp-brutal-card shadow-none">
                <CardHeader>
                  <CardTitle className="font-display text-xl tracking-wide">Son Saha Ölçümleri</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentSurveys.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Henüz ölçüm kaydı yok.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-muted-foreground">
                            <th className="pb-2">Proje</th>
                            <th className="pb-2">Tarih</th>
                            <th className="pb-2">Kalite</th>
                            <th className="pb-2">Durum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentSurveys.map((survey) => (
                            <tr key={survey.id} className="border-b border-border/50">
                              <td className="py-2 font-medium">
                                {survey.project?.projectNumber}
                                <span className="ml-1 text-muted-foreground">({survey.project?.clientName})</span>
                              </td>
                              <td className="py-2">{formatDate(survey.surveyedAt)}</td>
                              <td className="py-2">{formatSurveyQuality(survey.surveyQuality)}</td>
                              <td className="py-2">
                                <Badge variant="secondary">{formatSurveyStatus(survey.status)}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="sp-brutal-card shadow-none">
                <CardHeader>
                  <CardTitle className="font-display text-xl tracking-wide">CNC Makine Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.machines.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Henüz makine atanmamış proje yok.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-muted-foreground">
                            <th className="pb-2">Makine</th>
                            <th className="pb-2">Proje Sayısı</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.machines.map((m) => (
                            <tr key={m.machineName} className="border-b border-border/50">
                              <td className="py-2 font-medium">{m.machineName}</td>
                              <td className="py-2">
                                <Badge variant="secondary">{m.projectCount} proje</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="sp-brutal-card shadow-none">
              <CardHeader>
                <CardTitle className="font-display text-xl tracking-wide">Aylık Ölçüm Trendi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2">Ay</th>
                        <th className="pb-2">Saha Ölçümü</th>
                        <th className="pb-2">Revizyon</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.monthlyTrend.map((row) => (
                        <tr key={row.month} className="border-b border-border/50">
                          <td className="py-2 font-medium">{row.month}</td>
                          <td className="py-2">{row.siteSurveys}</td>
                          <td className="py-2">{row.revisions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
