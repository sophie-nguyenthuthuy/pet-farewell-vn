import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth';

export const metadata: Metadata = { title: 'Đăng nhập' };

async function loginAction(formData: FormData) {
  'use server';
  await signIn('credentials', {
    email: String(formData.get('email')),
    password: String(formData.get('password')),
    redirectTo: '/dashboard',
  });
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Đăng nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full">Đăng nhập</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Chưa có tài khoản? <Link href="/register" className="text-primary underline">Đăng ký</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
