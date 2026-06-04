import { BookingStatus, PaymentStatus } from '@/lib/types';
import { BOOKING_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/lib/utils';

interface Props {
  type: 'booking' | 'payment';
  status: BookingStatus | PaymentStatus;
}

export default function StatusBadge({ type, status }: Props) {
  const config =
    type === 'booking'
      ? BOOKING_STATUS_CONFIG[status as BookingStatus]
      : PAYMENT_STATUS_CONFIG[status as PaymentStatus];

  return (
    <span
      className="badge"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}
