'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreateBookingSchema } from '@/lib/validation';
import { submitBookingAction } from '@/server/actions/booking';
import { formatVnd } from '@/lib/utils';
import { cn } from '@/lib/utils/cn';

type ServiceOption = {
  id: string;
  slug: string;
  nameVi: string;
  shortVi: string;
  basePriceVnd: number;
  tiers: Array<{ sizeBand: 'XS' | 'S' | 'M' | 'L' | 'XL'; priceVnd: number }>;
};

const SPECIES = [
  { value: 'DOG', label: 'Chó' },
  { value: 'CAT', label: 'Mèo' },
  { value: 'RABBIT', label: 'Thỏ' },
  { value: 'BIRD', label: 'Chim' },
  { value: 'HAMSTER', label: 'Hamster' },
  { value: 'REPTILE', label: 'Bò sát' },
  { value: 'OTHER', label: 'Khác' },
] as const;

const SIZE_BANDS = [
  { value: 'XS', label: 'Rất nhỏ (< 5kg)' },
  { value: 'S', label: 'Nhỏ (5–10kg)' },
  { value: 'M', label: 'Trung bình (10–20kg)' },
  { value: 'L', label: 'Lớn (20–35kg)' },
  { value: 'XL', label: 'Rất lớn (> 35kg)' },
] as const;

const CITIES = [
  { value: 'HANOI', label: 'Hà Nội' },
  { value: 'HCMC', label: 'TP. Hồ Chí Minh' },
] as const;

export function BookingForm({ services }: { services: ServiceOption[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    petName: '',
    species: 'DOG',
    breed: '',
    sizeBand: 'S' as 'XS' | 'S' | 'M' | 'L' | 'XL',
    weightKg: '',
    notes: '',
    serviceId: services[0]?.id ?? '',
    livestream: false,
    griefCounseling: false,
    pickupRequired: true,
    pickupAddress: '',
    pickupCity: 'HANOI' as 'HANOI' | 'HCMC',
    pickupDistrict: '',
    scheduledFor: '',
    acceptTerms: false,
  });

  const selectedService = services.find((s) => s.id === form.serviceId);
  const tierPrice =
    selectedService?.tiers.find((t) => t.sizeBand === form.sizeBand)?.priceVnd ??
    selectedService?.basePriceVnd ??
    0;

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const payload = {
      contact: {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      pet: {
        name: form.petName.trim(),
        species: form.species,
        breed: form.breed.trim() || null,
        sizeBand: form.sizeBand,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
        notes: form.notes.trim() || null,
      },
      service: {
        serviceId: form.serviceId,
        addOnIds: [],
        livestream: form.livestream,
        griefCounseling: form.griefCounseling,
      },
      pickup: {
        pickupRequired: form.pickupRequired,
        pickupAddress: form.pickupAddress.trim() || null,
        pickupCity: form.pickupCity,
        pickupDistrict: form.pickupDistrict.trim() || null,
        scheduledFor: form.scheduledFor ? new Date(form.scheduledFor) : new Date(),
      },
      acceptTerms: form.acceptTerms,
    };

    const parsed = CreateBookingSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
      setError('Vui lòng kiểm tra lại thông tin');
      return;
    }

    const fd = new FormData();
    fd.set('payload', JSON.stringify(parsed.data));

    startTransition(async () => {
      const res = await submitBookingAction({ status: 'idle' }, fd);
      if (res.status === 'error') {
        setError(res.message);
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      } else if (res.status === 'success') {
        router.push(`/booking/success?code=${res.bookingCode}`);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Họ và tên" error={fieldErrors['contact.fullName']?.[0]}>
              <Input
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                placeholder="Nguyễn Văn A"
                required
              />
            </Field>
            <Field label="Email" error={fieldErrors['contact.email']?.[0]}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="ban@email.com"
                required
              />
            </Field>
            <Field label="Số điện thoại" error={fieldErrors['contact.phone']?.[0]}>
              <Input
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="0901234567"
                required
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Về bé yêu của bạn</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Tên bé" error={fieldErrors['pet.name']?.[0]}>
              <Input
                value={form.petName}
                onChange={(e) => set('petName', e.target.value)}
                placeholder="Misa"
                required
              />
            </Field>
            <Field label="Loài">
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.species}
                onChange={(e) => set('species', e.target.value)}
              >
                {SPECIES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Giống (tuỳ chọn)">
              <Input value={form.breed} onChange={(e) => set('breed', e.target.value)} />
            </Field>
            <Field label="Cân nặng (kg, tuỳ chọn)">
              <Input
                inputMode="decimal"
                value={form.weightKg}
                onChange={(e) => set('weightKg', e.target.value)}
              />
            </Field>
            <Field label="Kích thước" className="md:col-span-2">
              <div className="grid grid-cols-5 gap-2">
                {SIZE_BANDS.map((s) => (
                  <button
                    type="button"
                    key={s.value}
                    onClick={() => set('sizeBand', s.value)}
                    className={cn(
                      'rounded-md border px-2 py-2 text-xs',
                      form.sizeBand === s.value
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-input text-muted-foreground',
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Ghi chú cho đội ngũ" className="md:col-span-2">
              <Textarea
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Ví dụ: bé có vòng cổ kỷ niệm, gia đình muốn giữ lại."
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Lựa chọn dịch vụ</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3">
              {services.map((s) => {
                const price =
                  s.tiers.find((t) => t.sizeBand === form.sizeBand)?.priceVnd ?? s.basePriceVnd;
                const active = form.serviceId === s.id;
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => set('serviceId', s.id)}
                    className={cn(
                      'rounded-lg border p-4 text-left transition',
                      active ? 'border-primary bg-primary/5' : 'border-input',
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{s.nameVi}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{s.shortVi}</p>
                      </div>
                      <Badge variant="outline">{formatVnd(price)}</Badge>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-2 rounded-md border border-input p-4">
              <Toggle
                checked={form.livestream}
                onChange={(v) => set('livestream', v)}
                label="Bổ sung livestream lễ tiễn (+ 800.000đ)"
                hint="Camera HD, đường truyền riêng tư, lưu lại 30 ngày."
              />
              <Toggle
                checked={form.griefCounseling}
                onChange={(v) => set('griefCounseling', v)}
                label="Đăng ký buổi đồng hành tâm lý 1:1"
                hint="Chuyên gia tâm lý sẽ liên hệ trong 24 giờ."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Đón & lịch hẹn</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Thành phố">
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.pickupCity}
                onChange={(e) => set('pickupCity', e.target.value as 'HANOI' | 'HCMC')}
              >
                {CITIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Quận / Huyện">
              <Input
                value={form.pickupDistrict}
                onChange={(e) => set('pickupDistrict', e.target.value)}
                placeholder="VD: Quận 1, Hoàn Kiếm…"
              />
            </Field>
            <Field
              label="Địa chỉ đón"
              className="md:col-span-2"
              error={fieldErrors['pickup.pickupAddress']?.[0]}
            >
              <Input
                value={form.pickupAddress}
                onChange={(e) => set('pickupAddress', e.target.value)}
                placeholder="Số nhà, đường, phường…"
              />
            </Field>
            <Field
              label="Thời gian mong muốn"
              error={fieldErrors['pickup.scheduledFor']?.[0]}
            >
              <Input
                type="datetime-local"
                value={form.scheduledFor}
                onChange={(e) => set('scheduledFor', e.target.value)}
              />
            </Field>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Tóm tắt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Dịch vụ" value={selectedService?.nameVi ?? '—'} />
            <Row label="Kích thước" value={form.sizeBand} />
            <Row label="Phí dịch vụ" value={formatVnd(tierPrice)} />
            {form.livestream && <Row label="Livestream" value={formatVnd(800_000)} />}
            {form.griefCounseling && <Row label="Đồng hành tâm lý" value={formatVnd(1_500_000)} />}
            <Separator />
            <Row
              label="Tổng tạm tính"
              value={formatVnd(
                tierPrice +
                  (form.livestream ? 800_000 : 0) +
                  (form.griefCounseling ? 1_500_000 : 0),
              )}
              bold
            />
            <p className="pt-2 text-xs text-muted-foreground">
              Giá trên là tham khảo. Chi phí cuối cùng được xác nhận sau khi đội ngũ liên hệ.
            </p>
          </CardContent>
        </Card>

        <label className="flex items-start gap-3 rounded-md border p-3 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.acceptTerms}
            onChange={(e) => set('acceptTerms', e.target.checked)}
          />
          <span>
            Tôi đã đọc và đồng ý với <a className="underline" href="/terms">điều khoản dịch vụ</a> và
            <a className="ml-1 underline" href="/privacy">chính sách bảo mật</a>.
          </span>
        </label>

        {error && (
          <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? 'Đang gửi…' : 'Gửi yêu cầu đặt lịch'}
        </Button>
      </aside>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted/40">
      <input
        type="checkbox"
        className="mt-1"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn(bold && 'font-semibold')}>{value}</span>
    </div>
  );
}
