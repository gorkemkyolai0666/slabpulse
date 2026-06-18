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
import { formatSlabStatus, formatAreaSqm } from '@/lib/utils';

interface SlabItem {
  id: string;
  slabName: string;
  stoneType?: string;
  quantitySqm: number;
  slabUnit?: string;
  status: string;
}

export default function SlabsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<SlabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ slabName: '', stoneType: '', quantitySqm: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.slabs
      .list(token)
      .then((data) => setItems((data as { data: SlabItem[] }).data))
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
      await api.slabs.create(token, {
        ...form,
        quantitySqm: parseFloat(form.quantitySqm),
      });
      setForm({ slabName: '', stoneType: '', quantitySqm: '' });
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
            <h1 className="font-display text-3xl font-bold uppercase">Levha Stok</h1>
            <p className="text-muted-foreground">Doğal taş levha envanter takibi</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="font-display uppercase">
            <Plus className="mr-2 h-4 w-4" />
            Levha Ekle
          </Button>
        </div>

        {showForm && (
          <Card className="sp-brutal-card shadow-none">
            <CardHeader>
              <CardTitle className="font-display uppercase">Levha Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="slabName">Levha Adı</Label>
                  <Input
                    id="slabName"
                    value={form.slabName}
                    onChange={(e) => setForm({ ...form, slabName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stoneType">Taş Türü</Label>
                  <Input
                    id="stoneType"
                    value={form.stoneType}
                    onChange={(e) => setForm({ ...form, stoneType: e.target.value })}
                    placeholder="Mermer, granit, traverten..."
                  />
                </div>
                <div>
                  <Label htmlFor="quantitySqm">Alan (m²)</Label>
                  <Input
                    id="quantitySqm"
                    type="number"
                    step="0.1"
                    value={form.quantitySqm}
                    onChange={(e) => setForm({ ...form, quantitySqm: e.target.value })}
                    required
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
        {!loading && !error && items.length === 0 && (
          <EmptyState title="Levha bulunamadı" description="İlk levha stok kaydınızı ekleyin." />
        )}
        {!loading && !error && items.length > 0 && (
          <Card className="sp-brutal-card shadow-none">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">Levha</th>
                      <th className="pb-2">Taş Türü</th>
                      <th className="pb-2">Alan</th>
                      <th className="pb-2">Birim</th>
                      <th className="pb-2">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-border/50">
                        <td className="py-2 font-medium">{item.slabName}</td>
                        <td className="py-2">{item.stoneType || '—'}</td>
                        <td className="py-2">{formatAreaSqm(item.quantitySqm)}</td>
                        <td className="py-2 text-muted-foreground">{item.slabUnit || 'slab'}</td>
                        <td className="py-2">
                          <Badge variant="secondary">{formatSlabStatus(item.status)}</Badge>
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
