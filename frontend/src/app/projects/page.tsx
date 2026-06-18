'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatProjectStatus, formatProjectType } from '@/lib/utils';

interface Project {
  id: string;
  projectNumber: string;
  clientName: string;
  status: string;
  projectType?: string;
  areaSqm?: number;
  machineName?: string;
}

export default function ProjectsPage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ projectNumber: '', clientName: '', areaSqm: '', machineName: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.projects
      .list(token)
      .then((data) => setProjects((data as { data: Project[] }).data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await api.projects.create(token, {
        ...form,
        areaSqm: form.areaSqm ? parseFloat(form.areaSqm) : undefined,
        projectType: 'countertop',
      });
      setForm({ projectNumber: '', clientName: '', areaSqm: '', machineName: '' });
      setShowForm(false);
      load();
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl">Taş Projeleri</h1>
            <p className="text-muted-foreground">Müşteri projeleri, CNC ataması ve durum takibi</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Proje
          </Button>
        </div>

        {showForm && (
          <Card className="sp-brutal-card shadow-none">
            <CardHeader>
              <CardTitle className="font-display">Proje Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="projectNumber">Proje No</Label>
                  <Input
                    id="projectNumber"
                    value={form.projectNumber}
                    onChange={(e) => setForm({ ...form, projectNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientName">Müşteri</Label>
                  <Input
                    id="clientName"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="areaSqm">Alan (m²)</Label>
                  <Input
                    id="areaSqm"
                    type="number"
                    value={form.areaSqm}
                    onChange={(e) => setForm({ ...form, areaSqm: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="machineName">CNC Makine</Label>
                  <Input
                    id="machineName"
                    value={form.machineName}
                    onChange={(e) => setForm({ ...form, machineName: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {!loading && !error && projects.length === 0 && (
          <EmptyState title="Proje bulunamadı" description="İlk taş projenizi ekleyerek başlayın." />
        )}
        {!loading && !error && projects.length > 0 && (
          <Card className="sp-brutal-card shadow-none">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">Proje No</th>
                      <th className="pb-2">Müşteri</th>
                      <th className="pb-2">Tip</th>
                      <th className="pb-2">Alan</th>
                      <th className="pb-2">Makine</th>
                      <th className="pb-2">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b border-border/50">
                        <td className="py-2 font-medium">{project.projectNumber}</td>
                        <td className="py-2">{project.clientName}</td>
                        <td className="py-2 text-muted-foreground">
                          {formatProjectType(project.projectType || 'countertop')}
                        </td>
                        <td className="py-2">{project.areaSqm ? `${project.areaSqm} m²` : '—'}</td>
                        <td className="py-2">{project.machineName || '—'}</td>
                        <td className="py-2">
                          <Badge variant="secondary">{formatProjectStatus(project.status)}</Badge>
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
