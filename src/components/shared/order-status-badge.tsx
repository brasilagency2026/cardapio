import { getStatusColor, getStatusLabel } from "@/lib/utils";

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusColor(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

export function TableStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusColor(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
