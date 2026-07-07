import { useAppMutation } from '@/api/useAppMutation'
import { useAppQuery } from '@/api/useAppQuery'
import AppAvatar from '@/components/shared/AppAvatar'
import AppInput from '@/components/shared/AppInput'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useAuth } from '@/context/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { ShieldCheck, Trash2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const addUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  email: z.string().email('Invalid email'),

  password: z.string().min(6, 'Minimum 6 characters'),

  role: z.enum(['engineer', 'admin']),

  team: z.string(),

  isOnCall: z.boolean()
})

type AddUserForm = z.infer<typeof addUserSchema>

export default function Team() {
  const { user } = useAuth()

  const queryClient = useQueryClient()

  const [pendingDeleteUser, setPendingDeleteUser] = useState<any>(null)

  const form = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),

    defaultValues: {
      name: '',
      email: '',
      password: 'hello123',
      role: 'engineer',
      team: 'Reliability',
      isOnCall: false
    }
  })

  /**
   * users
   */

  const { data, isPending } = useAppQuery<any>({
    queryKey: ['users'],
    url: '/auth/users'
  })

  const users = (data?.data.users ?? [])?.filter(
    (u: TIUser) => u.id != user?.id
  )

  /**
   * mutations
   */

  const createUser = useAppMutation({
    method: 'post'
  })

  const removeUser = useAppMutation({
    method: 'delete'
  })

  async function onSubmit(values: AddUserForm) {
    try {
      await createUser.mutateAsync({
        url: '/auth/users',
        data: values
      })

      toast.success('Engineer added', {
        description: 'User added to reliability team'
      })

      form.reset({
        name: '',
        email: '',
        password: 'hello123',
        role: 'engineer',
        team: 'Reliability',
        isOnCall: false
      })

      queryClient.invalidateQueries({
        queryKey: ['users']
      })
    } catch (err: any) {
      form.setError('root', {
        message: err.response?.data?.message || 'Only admin can add users'
      })

      toast.error(err.response?.data?.message || 'Only admin can add users')
    }
  }

  async function deleteUser() {
    if (!pendingDeleteUser) return

    try {
      await removeUser.mutateAsync({
        url: `/auth/users/${pendingDeleteUser.id}`
      })

      toast.success('User removed', {
        description: `${pendingDeleteUser.name} removed from roster`
      })

      setPendingDeleteUser(null)

      queryClient.invalidateQueries({
        queryKey: ['users']
      })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Unable to delete user')
    }
  }

  return (
    <section className='space-y-8'>
      <div className='grid gap-8 lg:grid-cols-2'>
        {/* roster */}

        <Card className='glass-panel'>
          <CardContent className='space-y-6 p-6'>
            <div className='flex items-center gap-3'>
              <ShieldCheck className='text-primary' />

              <h2 className='text-2xl font-bold'>On-Call Roster</h2>
            </div>

            <div className='space-y-4'>
              {users.map((u: any) => (
                <div
                  key={u.id}
                  className='
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-border/40
                  bg-background/40
                  p-4
                  '>
                  <div className='flex items-center gap-3'>
                    <AppAvatar user={u.name} />

                    <div>
                      <h3 className='font-semibold'>{u.name}</h3>

                      <p className='text-sm text-muted-foreground'>
                        {u.email}
                        {' · '}
                        {u.team}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <Badge variant={u.isOnCall ? 'default' : 'secondary'}>
                      {u.isOnCall ? 'ON CALL' : 'BACKUP'}
                    </Badge>

                    {user?.role === 'admin' && user?.id !== u.id && (
                      <Button
                        size='icon'
                        variant='destructive'
                        onClick={() => setPendingDeleteUser(u)}>
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* add engineer */}

        <Card className='glass-panel'>
          <CardContent className='space-y-5 p-6'>
            <h2 className='flex items-center gap-2 text-2xl font-bold'>
              <UserPlus />
              Add Engineer
            </h2>

            <p className='text-sm text-muted-foreground'>
              Current role: {user?.role}
            </p>

            <form id='add-user-form' onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name='name'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <AppInput
                      label='Name'
                      field={field}
                      fieldState={fieldState}
                      placeholder='John Doe'
                    />
                  )}
                />

                <Controller
                  name='email'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <AppInput
                      label='Email'
                      field={field}
                      fieldState={fieldState}
                      placeholder='engineer@company.com'
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
                      type='password'
                      placeholder='********'
                    />
                  )}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <Controller
                    name='role'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Role</FieldLabel>

                        <Select
                          value={field.value}
                          onValueChange={field.onChange}>
                          <SelectTrigger
                            aria-invalid={fieldState.invalid}
                            className='w-full'>
                            <SelectValue placeholder='Select role' />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value='engineer'>Engineer</SelectItem>

                            <SelectItem value='admin'>Admin</SelectItem>
                          </SelectContent>
                        </Select>

                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name='team'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <AppInput
                        label='Team'
                        field={field}
                        fieldState={fieldState}
                      />
                    )}
                  />
                </div>

                <Controller
                  name='isOnCall'
                  control={form.control}
                  render={({ field }) => (
                    <div className='flex items-center gap-3'>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />

                      <span className='text-sm'>On-call now</span>
                    </div>
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

          <CardFooter className='border-0 bg-transparent pt-0'>
            <Button
              form='add-user-form'
              type='submit'
              className='h-11 w-full bg-accent text-white uppercase font-semibold tracking-wide hover:bg-accent/90 cursor-pointer'
              disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Adding...' : 'Add User'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* delete modal */}

      <AlertDialog
        open={!!pendingDeleteUser}
        onOpenChange={() => setPendingDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>

            <AlertDialogDescription>
              Remove <b>{pendingDeleteUser?.name}</b> from roster?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction className='bg-destructive' onClick={deleteUser}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
