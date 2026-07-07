import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import AppInput from '@/components/shared/AppInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup
} from '@/components/ui/field'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router'

const schema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginForm = z.infer<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'admin@auto-reliability.com',
      password: 'hello123'
    }
  })

  async function onSubmit(values: LoginForm) {
    try {
      await login(values)

      navigate('/')
    } catch (err: any) {
      form.setError('root', {
        message: err.response?.data?.message ?? 'Login failed'
      })
    }
  }

  return (
    <main>
      <Card className='w-full max-w-md rounded-2xl bg-transparent border-0 ring-0 shadow-2xl space-y-0 backdrop-blur-2xl'>
        <CardContent>
          <form
            id='login-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='text-white'>
            <FieldGroup>
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <AppInput
                    label='Email'
                    field={field}
                    fieldState={fieldState}
                    placeholder='admin@company.com'
                    autoComplete='email'
                    aria-invalid={fieldState.invalid}
                  />
                )}
              />

              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <AppInput
                    label='Password'
                    field={field}
                    fieldState={fieldState}
                    placeholder='...........'
                    type='password'
                    autoComplete='current-password'
                    aria-invalid={fieldState.invalid}
                  />
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
        <CardFooter className='border-0 bg-transparent flex-col pt-0'>
          <Button
            form='login-form'
            type='submit'
            className='h-11 w-full bg-accent text-white uppercase font-semibold tracking-wide hover:bg-accent/90 cursor-pointer'
            disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </CardFooter>
      </Card>
      
    </main>
  )
}
