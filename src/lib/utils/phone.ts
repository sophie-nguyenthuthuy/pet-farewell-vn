const VN_PHONE = /^(\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;

export function isValidVietnamesePhone(phone: string): boolean {
  return VN_PHONE.test(phone.replace(/\s|-/g, ''));
}

export function normalizeVietnamesePhone(phone: string): string {
  const cleaned = phone.replace(/\s|-/g, '');
  if (cleaned.startsWith('+84')) return '0' + cleaned.slice(3);
  return cleaned;
}
