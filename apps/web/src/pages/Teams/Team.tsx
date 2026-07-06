import { useState } from 'react'
import { Trash2, UserPlus, ShieldCheck, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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
import { useAuth } from '@/context/AuthContext'
import { useAppQuery } from '@/api/useAppQuery'
import { useAppMutation } from '@/api/useAppMutation'
import { cn } from '@/lib/utils'
import { getAvatarColor, getInitials } from '@/lib/avatar'
import AppAvatar from '@/components/shared/AppAvatar'

export default function Team() {
  const { user } = useAuth()

  const queryClient = useQueryClient()

  const [pendingDeleteUser, setPendingDeleteUser] = useState<any>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'hello123',
    role: 'engineer',
    team: 'Reliability',
    isOnCall: false
  })

  /**
   * users
   */

  const { data, isPending } = useAppQuery<any>({
    queryKey: ['users'],
    url: '/auth/users'
  })

  const users = (data?.data.users ?? [])?.filter((u:TIUser)=>u.id!=user?.id)

  /**
   * mutations
   */

  const createUser = useAppMutation({
    method: 'post'
  })

  const removeUser = useAppMutation({
    method: 'delete'
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    try {
      await createUser.mutateAsync({
        url: '/auth/users',
        data: form
      })

      toast.success('Engineer added', {
        description: 'User added to reliability team'
      })

      setForm({
        ...form,
        name: '',
        email: ''
      })

      queryClient.invalidateQueries({
        queryKey: ['users']
      })
    } catch (err: any) {
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
                    <AppAvatar user={u.name}/>
             

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

            <Input
              placeholder='Name'
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />

            <Input
              placeholder='Email'
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
            />

            <Input
              placeholder='Password'
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
            />

            <div className='grid grid-cols-2 gap-4'>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    role: v!
                  })
                }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value='engineer'>Engineer</SelectItem>

                  <SelectItem value='admin'>Admin</SelectItem>
                </SelectContent>
              </Select>

              <Input
                value={form.team}
                onChange={(e) =>
                  setForm({
                    ...form,
                    team: e.target.value
                  })
                }
              />
            </div>

            <div className='flex items-center gap-3'>
              <Checkbox
                checked={form.isOnCall}
                onCheckedChange={(v) =>
                  setForm({
                    ...form,
                    isOnCall: Boolean(v)
                  })
                }
              />

              <span className='text-sm'>On-call now</span>
            </div>

            <Button className='w-full' onClick={submit}>
              Add User
            </Button>
          </CardContent>
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
