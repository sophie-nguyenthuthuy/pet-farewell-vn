const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateFormatterVi = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Asia/Ho_Chi_Minh',
});

const dateFormatterEn = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Asia/Ho_Chi_Minh',
});

export function formatVnd(value: number): string {
  return vndFormatter.format(value);
}

export function formatDateTime(value: Date | string, locale: 'vi' | 'en' = 'vi'): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return (locale === 'en' ? dateFormatterEn : dateFormatterVi).format(date);
}

export function bookingCode(seq: number, year = new Date().getFullYear()): string {
  return `BK-${year}-${seq.toString().padStart(6, '0')}`;
}
