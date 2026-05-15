'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { formatVnd } from '@/lib/utils';
import { CreateBookingSchema, type CreateBookingInput } from '@/lib/validation';
import { submitBookingAction } from '@/server/actions/booking';
import { cn } from '@/lib/utils/cn';

export type BookingFormService = {
  id: string;
  slug: string;
  nameVi: string;
  shortVi: string;
  basePriceVnd: number;
  tiers?: Array<{ sizeBand: 'XS' | 'S' | 'M' | 'L' | 'XL'; priceVnd: number }>;
};

const STEPS = ['Bé yêu', 'Dịch vụ', 'Đón & Lễ', 'Xác nhận'] as const;

type FormState = {
  contact: { fullName: string; email: string; phone: string };
  pet: {
    name: string;
    species: 'DOG' | 'CAT' | 'RABBIT' | 'BIRD' | 'HAMSTER' | 'REPTILE' | 'OTHER';
    sizeBand: 'XS' | 'S' | 'M' | 'L' | 'XL';
    weightKg?: number;
    breed?: string;
    notes?: string;
  };
  service: { serviceId: string; addOnIds: string[]; livestream: boolean; griefCounseling: boolean };
  pickup: {
    pickupRequired: boolean;
    pickupAddress?: string;
    pickupCity?: 'HANOI' | 'HCMC';
    pickupDistrict?: string;
    scheduledFor: string;
  };
  acceptTerms: boolean;
};

function defaultState(): FormState {
  return {
    contact: { fullName: '', email: '', phone: '' },
    pet: { name: '', species: 'DOG', sizeBand: 'S' },
    service: { serviceId: '', addOnIds: [], livestream: false, griefCounseling: false },
    pickup: {
      pickupRequired: true,
      pickupCity: 'HCMC',
      scheduledFor: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16),
    },
    acceptTerms: false,
  };
}

export function BookingForm({
  services,
  addOns = [],
}: {
  services: BookingFormService[];
  addOns?: BookingFormService[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FormState>(defaultState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selectedService = services.find((s) => s.id === state.service.serviceId);
  const tier = selectedService?.tiers?.find((t) => t.sizeBand === state.pet.sizeBand);
  const estimatedPrice = tier?.priceVnd ?? selectedService?.basePriceVnd ?? 0;
  const addOnTotal = state.service.addOnIds.reduce(
    (sum, id) => sum + (addOns.find((a) => a.id === id)?.basePriceVnd ?? 0),
    0,
  );

  function validateCurrent(): boolean {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!state.pet.name) e['pet.name'] = 'Vui lòng nhập tên bé';
    }
    if (step === 1) {
      if (!state.service.serviceId) e['service.serviceId'] = 'Vui lòng chọn dịch vụ';
    }
    if (step === 2) {
      if (state.pickup.pickupRequired && !state.pickup.pickupAddress) {
        e['pickup.pickupAddress'] = 'Vui lòng nhập địa chỉ đón';
      }
      if (!state.pickup.scheduledFor) e['pickup.scheduledFor'] = 'Vui lòng chọn thời gian';
    }
    if (step === 3) {
      if (!state.contact.fullName) e['contact.fullName'] = 'Vui lòng nhập họ tên';
      if (!/^\S+@\S+\.\S+$/.test(state.contact.email)) e['contact.email'] = 'Email không hợp lệ';
      if (!/^(?:\+?84|0)\d{9,10}$/.test(state.contact.phone.replace(/\s|-/g, '')))
        e['contact.phone'] = 'Số điện thoại không hợp lệ';
      if (!state.acceptTerms) e.acceptTerms = 'Vui lòng đồng ý điều khoản';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateCurrent()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function submit() {
    if (!validateCurrent()) return;

    const payload: CreateBookingInput = {
      contact: state.contact,
      pet: { ...state.pet, weightKg: state.pet.weightKg ?? undefined },
      service: state.service,
      pickup: { ...state.pickup, scheduledFor: new Date(state.pickup.scheduledFor) },
      acceptTerms: state.acceptTerms as true,
    };

    const parsed = CreateBookingSchema.safeParse(payload);
    if (!parsed.success) {
      setServerError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    const fd = new FormData();
    fd.set('payload', JSON.stringify(parsed.data));

    startTransition(async () => {
      setServerError(null);
      const result = await submitBookingAction({ status: 'idle' }, fd);
      if (result.status === 'error') {
        setServerError(result.message);
      } else if (result.status === 'success') {
        router.push(`/booking/success?code=${result.bookingCode}`);
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <ol className="mb-6 flex flex-wrap gap-2 text-sm">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={cn(
                'flex items-center gap-2 rounded-full border px-3 py-1.5',
                i === step ? 'border-primary text-primary' : 'text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'grid h-5 w-5 place-items-center rounded-full text-xs',
                  i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted',
                )}
              >
                {i + 1}
              </span>
              {label}
            </li>
          ))}
        </ol>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">{STEPS[step]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {step === 0 && <PetStep state={state} setState={setState} errors={errors} />}
            {step === 1 && (
              <ServiceStep
                services={services}
                addOns={addOns}
                state={state}
                setState={setState}
                errors={errors}
              />
            )}
            {step === 2 && <PickupStep state={state} setState={setState} errors={errors} />}
            {step === 3 && <ConfirmStep state={state} setState={setState} errors={errors} />}

            {serverError && (
              <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {serverError}
              </p>
            )}

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0 || pending}
              >
                Quay lại
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={next}>Tiếp tục</Button>
              ) : (
                <Button onClick={submit} disabled={pending}>
                  {pending ? 'Đang gửi…' : 'Gửi yêu cầu'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Tóm tắt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Bé" value={state.pet.name || '—'} />
            <Row label="Cỡ" value={state.pet.sizeBand} />
            <Row label="Dịch vụ" value={selectedService?.nameVi ?? '—'} />
            <Row label="Lịch" value={state.pickup.scheduledFor.replace('T', ' ')} />
            <hr />
            <Row label="Ước tính" value={formatVnd(estimatedPrice + addOnTotal)} bold />
            <p className="text-xs text-muted-foreground">
              Giá có thể thay đổi sau khi đội điều phối xác nhận đón.
            </p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? 'font-semibold' : ''}>{value}</span>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function PetStep({
  state,
  setState,
  errors,
}: {
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field id="petName" label="Tên bé yêu" error={errors['pet.name']}>
        <Input
          id="petName"
          value={state.pet.name}
          onChange={(e) => setState({ ...state, pet: { ...state.pet, name: e.target.value } })}
        />
      </Field>
      <Field id="species" label="Loài">
        <select
          id="species"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={state.pet.species}
          onChange={(e) =>
            setState({
              ...state,
              pet: { ...state.pet, species: e.target.value as FormState['pet']['species'] },
            })
          }
        >
          <option value="DOG">Chó</option>
          <option value="CAT">Mèo</option>
          <option value="RABBIT">Thỏ</option>
          <option value="BIRD">Chim</option>
          <option value="HAMSTER">Hamster</option>
          <option value="REPTILE">Bò sát</option>
          <option value="OTHER">Khác</option>
        </select>
      </Field>
      <Field id="sizeBand" label="Cân nặng">
        <select
          id="sizeBand"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={state.pet.sizeBand}
          onChange={(e) =>
            setState({
              ...state,
              pet: { ...state.pet, sizeBand: e.target.value as FormState['pet']['sizeBand'] },
            })
          }
        >
          <option value="XS">Dưới 5kg</option>
          <option value="S">5–10kg</option>
          <option value="M">10–20kg</option>
          <option value="L">20–35kg</option>
          <option value="XL">Trên 35kg</option>
        </select>
      </Field>
      <Field id="breed" label="Giống (tuỳ chọn)">
        <Input
          id="breed"
          value={state.pet.breed ?? ''}
          onChange={(e) => setState({ ...state, pet: { ...state.pet, breed: e.target.value } })}
        />
      </Field>
      <div className="md:col-span-2">
        <Field id="notes" label="Ghi chú thêm về bé (tuỳ chọn)">
          <Textarea
            id="notes"
            value={state.pet.notes ?? ''}
            onChange={(e) => setState({ ...state, pet: { ...state.pet, notes: e.target.value } })}
          />
        </Field>
      </div>
    </div>
  );
}

function ServiceStep({
  services,
  addOns,
  state,
  setState,
  errors,
}: {
  services: BookingFormService[];
  addOns: BookingFormService[];
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {services.map((s) => {
          const tier = s.tiers?.find((t) => t.sizeBand === state.pet.sizeBand);
          const price = tier?.priceVnd ?? s.basePriceVnd;
          const selected = state.service.serviceId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setState({ ...state, service: { ...state.service, serviceId: s.id } })}
              className={cn(
                'rounded-lg border p-4 text-left transition-colors',
                selected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-lg">{s.nameVi}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.shortVi}</p>
                </div>
                <Badge variant="secondary">{formatVnd(price)}</Badge>
              </div>
            </button>
          );
        })}
      </div>
      {errors['service.serviceId'] && (
        <p className="text-xs text-destructive">{errors['service.serviceId']}</p>
      )}

      {addOns.length > 0 && (
        <div className="space-y-2 border-t pt-4">
          <p className="text-sm font-medium">Bổ sung (tuỳ chọn)</p>
          {addOns.map((a) => {
            const checked = state.service.addOnIds.includes(a.id);
            return (
              <label key={a.id} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setState({
                      ...state,
                      service: {
                        ...state.service,
                        addOnIds: checked
                          ? state.service.addOnIds.filter((id) => id !== a.id)
                          : [...state.service.addOnIds, a.id],
                      },
                    })
                  }
                />
                <span className="flex-1">{a.nameVi}</span>
                <span className="text-muted-foreground">{formatVnd(a.basePriceVnd)}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PickupStep({
  state,
  setState,
  errors,
}: {
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={state.pickup.pickupRequired}
          onChange={(e) =>
            setState({ ...state, pickup: { ...state.pickup, pickupRequired: e.target.checked } })
          }
        />
        Cần xe đón tận nhà (khuyến nghị)
      </label>

      {state.pickup.pickupRequired && (
        <>
          <Field id="city" label="Thành phố">
            <select
              id="city"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={state.pickup.pickupCity}
              onChange={(e) =>
                setState({
                  ...state,
                  pickup: {
                    ...state.pickup,
                    pickupCity: e.target.value as FormState['pickup']['pickupCity'],
                  },
                })
              }
            >
              <option value="HCMC">TP. Hồ Chí Minh</option>
              <option value="HANOI">Hà Nội</option>
            </select>
          </Field>
          <Field id="address" label="Địa chỉ đón" error={errors['pickup.pickupAddress']}>
            <Input
              id="address"
              value={state.pickup.pickupAddress ?? ''}
              onChange={(e) =>
                setState({ ...state, pickup: { ...state.pickup, pickupAddress: e.target.value } })
              }
              placeholder="Số nhà, đường, phường, quận"
            />
          </Field>
        </>
      )}

      <Field id="when" label="Thời gian dự kiến" error={errors['pickup.scheduledFor']}>
        <Input
          id="when"
          type="datetime-local"
          value={state.pickup.scheduledFor}
          onChange={(e) =>
            setState({ ...state, pickup: { ...state.pickup, scheduledFor: e.target.value } })
          }
        />
      </Field>

      <div className="space-y-2 border-t pt-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={state.service.livestream}
            onChange={(e) =>
              setState({
                ...state,
                service: { ...state.service, livestream: e.target.checked },
              })
            }
          />
          Livestream lễ tiễn cho gia đình ở xa
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={state.service.griefCounseling}
            onChange={(e) =>
              setState({
                ...state,
                service: { ...state.service, griefCounseling: e.target.checked },
              })
            }
          />
          Đặt thêm phiên đồng hành tâm lý
        </label>
      </div>
    </div>
  );
}

function ConfirmStep({
  state,
  setState,
  errors,
}: {
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <Field id="fullName" label="Họ tên" error={errors['contact.fullName']}>
        <Input
          id="fullName"
          value={state.contact.fullName}
          onChange={(e) =>
            setState({ ...state, contact: { ...state.contact, fullName: e.target.value } })
          }
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="email" label="Email" error={errors['contact.email']}>
          <Input
            id="email"
            type="email"
            value={state.contact.email}
            onChange={(e) =>
              setState({ ...state, contact: { ...state.contact, email: e.target.value } })
            }
          />
        </Field>
        <Field id="phone" label="Số điện thoại" error={errors['contact.phone']}>
          <Input
            id="phone"
            value={state.contact.phone}
            onChange={(e) =>
              setState({ ...state, contact: { ...state.contact, phone: e.target.value } })
            }
            placeholder="09xxxxxxxx"
          />
        </Field>
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={state.acceptTerms}
          onChange={(e) => setState({ ...state, acceptTerms: e.target.checked })}
        />
        <span>
          Tôi đồng ý với{' '}
          <a href="/terms" className="underline" target="_blank" rel="noreferrer">
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a href="/privacy" className="underline" target="_blank" rel="noreferrer">
            Chính sách quyền riêng tư
          </a>
          .
        </span>
      </label>
      {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms}</p>}
    </div>
  );
}
