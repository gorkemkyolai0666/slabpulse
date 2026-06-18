import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `%${value}`;
}

export function formatAreaSqm(value: number): string {
  return `${value.toFixed(1)} m²`;
}

const PROJECT_STATUS: Record<string, string> = {
  quoted: 'Teklif',
  templating: 'Şablon',
  cutting: 'Kesim',
  polishing: 'Cila',
  edge_work: 'Kenar İşleme',
  installation: 'Montaj',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

export function formatProjectStatus(status: string): string {
  return PROJECT_STATUS[status] || status;
}

const SLAB_STATUS: Record<string, string> = {
  in_stock: 'Stokta',
  reserved: 'Rezerve',
  low: 'Düşük',
  out_of_stock: 'Tükendi',
};

export function formatSlabStatus(status: string): string {
  return SLAB_STATUS[status] || status;
}

const SURVEY_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  completed: 'Tamamlandı',
  revision: 'Revizyon',
  approved: 'Onaylandı',
  cancelled: 'İptal',
};

export function formatSurveyStatus(status: string): string {
  return SURVEY_STATUS[status] || status;
}

const CNC_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  overdue: 'Gecikmiş',
};

export function formatCncTaskStatus(status: string): string {
  return CNC_STATUS[status] || status;
}

const SURVEY_QUALITY: Record<string, string> = {
  excellent: 'Mükemmel',
  good: 'İyi',
  needs_review: 'İnceleme Gerek',
  rejected: 'Reddedildi',
};

export function formatSurveyQuality(value: string): string {
  return SURVEY_QUALITY[value] || value;
}

const FINISH_STATUS: Record<string, string> = {
  active: 'Aktif',
  seasonal: 'Mevsimlik',
  discontinued: 'Durduruldu',
};

export function formatFinishStatus(status: string): string {
  return FINISH_STATUS[status] || status;
}

const PROJECT_TYPE: Record<string, string> = {
  countertop: 'Tezgah',
  flooring: 'Zemin',
  facade: 'Cephe',
  vanity: 'Lavabo',
  stair: 'Merdiven',
  custom: 'Özel',
};

export function formatProjectType(value: string): string {
  return PROJECT_TYPE[value] || value;
}

const CNC_OPERATION: Record<string, string> = {
  cutting: 'Kesim',
  polishing: 'Cila',
  edge: 'Kenar',
  cnc_bridge: 'Köprü CNC',
  other: 'Diğer',
};

export function formatCncOperation(value: string): string {
  return CNC_OPERATION[value] || value;
}

const FINISH_CATEGORY: Record<string, string> = {
  polished: 'Parlatılmış',
  honed: 'Honlu',
  leather: 'Deri Dokulu',
  bush_hammered: 'Bush Hammer',
  flamed: 'Flame',
  other: 'Diğer',
};

export function formatFinishCategory(value: string): string {
  return FINISH_CATEGORY[value] || value;
}
