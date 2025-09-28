"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login, persistAccessToken } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { accessToken } = await login(values);
      persistAccessToken(accessToken);
    },
    onSuccess: () => {
      toast.success('Logged in successfully');
      router.push('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Login failed');
    }
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@example.com" autoComplete="email" {...register('email')} />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" {...register('password')} />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute inset-y-0 right-2 flex items-center text-xs text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? 'Logging in...' : 'Login'}
              </Button>
            </div>
            {mutation.isError && !errors.email && !errors.password && (
              <p className="text-xs text-red-600">Login failed. Check credentials.</p>
            )}
            <div className="mt-2 text-center text-xs text-muted-foreground">
              Token stored in localStorage (temporary). Replace with secure cookie strategy in `client.ts`.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
