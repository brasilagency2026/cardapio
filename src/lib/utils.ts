import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    FREE: "text-green-600 bg-green-50 border-green-200",
    OCCUPIED: "text-red-600 bg-red-50 border-red-200",
    WAITING_PAYMENT: "text-amber-600 bg-amber-50 border-amber-200",
    RESERVED: "text-gray-600 bg-gray-50 border-gray-200",
    PENDING: "text-blue-600 bg-blue-50 border-blue-200",
    ACCEPTED: "text-indigo-600 bg-indigo-50 border-indigo-200",
    PREPARING: "text-orange-600 bg-orange-50 border-orange-200",
    READY: "text-green-600 bg-green-50 border-green-200",
    DELIVERED: "text-gray-600 bg-gray-50 border-gray-200",
    CANCELLED: "text-red-600 bg-red-50 border-red-200",
  };
  return map[status] ?? "text-gray-600 bg-gray-50 border-gray-200";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    FREE: "Livre",
    OCCUPIED: "Ocupada",
    WAITING_PAYMENT: "Aguardando pagamento",
    RESERVED: "Reservada",
    PENDING: "Pendente",
    ACCEPTED: "Aceito",
    PREPARING: "Preparando",
    READY: "Pronto",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
    OPEN: "Aberta",
    PAID: "Paga",
    CLOSED: "Fechada",
  };
  return map[status] ?? status;
}
