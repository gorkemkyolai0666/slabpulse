'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatDate, formatSurveyStatus, formatSurveyQuality } from '@/lib/utils';

interface Survey {
  id: string;
  surveyedAt: string;
  status: string;
  surveyQuality: string;
  revisionNotes?: string | null;
  project?: { projectNumber: string; clientName: string };
}

export default function SurveysPage() {
  const { token } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.surveys
      .list(token)
      .then((data) => setSurveys((data as { data: Survey[] }).data))
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
          <h1 className="font-display text-3xl font-bold uppercase">Saha Ölçümleri</h1>
          <p className="text-muted-foreground">Montaj öncesi ölçüm, kalite kontrol ve revizyon takibi</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {!loading && !error && surveys.length === 0 && (
          <EmptyState title="Ölçüm bulunamadı" description="Henüz saha ölçüm kaydı yok." />
        )}
        {!loading && !error && surveys.length > 0 && (
          <Card className="sp-brutal-card shadow-none">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">Proje</th>
                      <th className="pb-2">Müşteri</th>
                      <th className="pb-2">Tarih</th>
                      <th className="pb-2">Kalite</th>
                      <th className="pb-2">Revizyon</th>
                      <th className="pb-2">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveys.map((survey) => (
                      <tr key={survey.id} className="border-b border-border/50">
                        <td className="py-2 font-medium">{survey.project?.projectNumber}</td>
                        <td className="py-2">{survey.project?.clientName}</td>
                        <td className="py-2">{formatDate(survey.surveyedAt)}</td>
                        <td className="py-2">{formatSurveyQuality(survey.surveyQuality)}</td>
                        <td className="py-2">{survey.revisionNotes || '—'}</td>
                        <td className="py-2">
                          <Badge variant="secondary">{formatSurveyStatus(survey.status)}</Badge>
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
