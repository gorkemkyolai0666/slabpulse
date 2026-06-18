import Link from 'next/link';
import { Gem, Layers, Ruler, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Gem,
    title: 'Proje Takibi',
    description: 'Tezgah, zemin ve cephe projelerini CNC ataması ve teslim tarihiyle yönetin.',
  },
  {
    icon: Layers,
    title: 'Levha Stok',
    description: 'Mermer, granit ve traverten levhaları m² bazında takip edin, düşük stok uyarıları alın.',
  },
  {
    icon: Ruler,
    title: 'Saha Ölçümü',
    description: 'Montaj öncesi ölçümleri, kalite kontrolünü ve revizyon notlarını dijitalleştirin.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sp-mineral-bg pointer-events-none fixed inset-0 -z-10" aria-hidden />

      <header className="sp-hero-block text-[hsl(var(--marble))]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="flex items-center gap-2 font-display text-2xl">
            <Gem className="h-6 w-6 text-primary" aria-hidden />
            Slab<span className="text-primary">Pulse</span>
          </span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-[hsl(var(--marble))] hover:bg-[hsl(var(--marble)/0.1)]">
              <Link href="/login">Giriş</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Ücretsiz Başla</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="sp-hero-block text-[hsl(var(--marble))]">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                Doğal Taş İşleme & CNC Atölye SaaS
              </p>
              <h1 className="font-display text-5xl leading-tight md:text-6xl">
                Taş atölyenizi uçtan uca yönetin
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[hsl(var(--marble)/0.8)]">
                Proje takibi, levha stok, CNC planlaması ve saha ölçümlerini Excel ve kağıt defterinden
                kurtarın. Türkiye&apos;deki KOBİ doğal taş işleme atölyeleri için tasarlandı.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/register">
                    14 Gün Ücretsiz Dene
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-[hsl(var(--marble)/0.3)] text-[hsl(var(--marble))] hover:bg-[hsl(var(--marble)/0.1)]">
                  <Link href="/login">Demo Giriş</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl">Özellikler</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="sp-brutal-card">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border/60 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-12 text-center">
            <h2 className="font-display text-3xl">Atölye ve sahayı tek panelde birleştirin</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              SlabPulse ile taş projelerinizi, levha stokunuzu ve CNC planlamanızı kolayca yönetin.
            </p>
            <Button className="mt-6" size="lg" asChild>
              <Link href="/register">Hemen Başlayın</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SlabPulse — Doğal Taş İşleme Operasyon Platformu
      </footer>
    </div>
  );
}
