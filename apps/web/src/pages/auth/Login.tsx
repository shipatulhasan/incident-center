import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAppMutation } from '@/api/useAppMutation'
import { useNavigate } from 'react-router'

const schema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginForm = z.infer<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'admin@auto-reliability.com',
      password: 'hello123'
    }
  })

  const login = useAppMutation<TLoginResponse, TLoginPayload>({
    url: '/auth/login'
  })

  async function onSubmit(values: LoginForm) {
    try {
      const res = await login.mutateAsync(values)
      console.log(res)

      localStorage.setItem('token', res.data.token)

      navigate('/')
    } catch (err: any) {
      form.setError('root', {
        message: err.response?.data?.message ?? 'Login failed'
      })
    }
  }

  return (
    <main className='w-[calc(100vw-2rem)] sm:contents'>
      <Card className='w-full max-w-md rounded-2xl border border-brand/40 bg-[#0B1020]/95 backdrop-blur-xl p-6 shadow-2xl'>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-3xl text-white'>Incident Center</CardTitle>

          <CardDescription>
            Sign in to access the incident center.
          </CardDescription>
        </CardHeader>

        <CardContent className='border-0'>
          <form
            id='login-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='text-white'>
            <FieldGroup>
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>

                    <Input
                      {...field}
                      placeholder='admin@company.com'
                      autoComplete='email'
                      className={cn(
                        'app-input-autofill-dark bg-[#020617] text-white h-11 focus-visible:ring-1 border-gray-700 mt-1',
                        fieldState.error
                          ? 'border-red-500 focus-visible:ring-red-500 pr-9'
                          : 'focus-visible:ring-brand'
                      )}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>

                    <Input
                      {...field}
                      type='password'
                      autoComplete='current-password'
                      className={cn(
                        'app-input-autofill-dark bg-[#020617] text-white h-11 focus-visible:ring-1 border-gray-700 mt-1',
                        fieldState.error
                          ? 'border-red-500 focus-visible:ring-red-500 pr-9'
                          : 'focus-visible:ring-brand'
                      )}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {form.formState.errors.root && (
                <Field>
                  <FieldError errors={[form.formState.errors.root]} />
                </Field>
              )}
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className='flex-col items-stretch gap-4 border-0 bg-transparent'>
          <Button
            form='login-form'
            type='submit'
            className='h-11 w-full bg-accent uppercase font-semibold tracking-wide hover:bg-accent/90'
            disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className='text-sm text-slate-400'>
            Demo account
            <br />
            admin@auto-reliability.com
            <br />
            hello123
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}
