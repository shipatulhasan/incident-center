import { useState } from 'react'
import { Link } from 'react-router'
import { Bell } from 'lucide-react'

import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { ScrollArea } from '@/components/ui/scroll-area'

import { cn } from '@/lib/utils'
import { useAppQuery } from '@/api/useAppQuery'
import { useAppMutation } from '@/api/useAppMutation'



type TNotification = {
  _id: string

  title: string

  message: string

  read: boolean

  createdAt: string

  incident?: {
    _id: string
    title: string
  }
}

export default function Notifications() {
  const queryClient = useQueryClient()

  const [active, setActive] = useState<string | null>(null)

  const { data } = useAppQuery<{
    data: {
      notifications: TNotification[]
    }
  }>({
    queryKey: ['notifications'],

    url: '/notifications',

    refetchInterval: 30000
  })

  const notifications = data?.data.notifications ?? []

  const unread = notifications.filter((n) => !n.read).length

  const markRead = useAppMutation({
    method: 'patch'
  })

  async function openNotification(note: TNotification) {
    setActive(active === note._id ? null : note._id)

    if (note.read) return

    await markRead.mutateAsync({
      url: `/notifications/${note._id}/read`
    })

    queryClient.setQueryData(
      ['notifications'],

      (old: any) => {
        if (!old) return old

        return {
          ...old,

          data: {
            notifications: old.data.notifications.map((n: TNotification) =>
              n._id === note._id
                ? {
                    ...n,
                    read: true
                  }
                : n
            )
          }
        }
      }
    )
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant='outline'
          size='icon'
          className='glass-control relative cursor-pointer hover:bg-inherit'>
          <Bell className='size-5' />

          {unread > 0 && (
            <span
              className='
absolute
-right-1
-top-1
flex
size-5
items-center
justify-center
rounded-full
bg-brand
text-[10px]
font-bold
text-white
'>
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align='end'
        sideOffset={10}
        className='
glass-panel
w-96
border-border/40
p-0
'>
        <div
          className='
flex
items-center
justify-between
border-b
border-border/40
p-4
'>
          <h3 className='font-bold'>Notifications</h3>

          <Badge variant='secondary'>{unread} new</Badge>
        </div>

        <ScrollArea className='h-[420px]'>
          <div className='space-y-2 p-3'>
            {notifications.length === 0 && (
              <p className='py-10 text-center text-sm text-muted-foreground'>
                No notifications yet.
              </p>
            )}

            {notifications.map((note) => (
              <div
                key={note._id}
                onClick={() => openNotification(note)}
                className={cn(
                  `
cursor-pointer
rounded-xl
border
p-4
transition
hover:bg-primary/10
`,

                  note.read
                    ? 'border-border/40 bg-background/30'
                    : 'border-primary/30 bg-primary/10'
                )}>
                <div className='flex justify-between gap-3'>
                  <h4 className='font-semibold'>{note.title}</h4>

                  {!note.read && (
                    <div className='mt-1 size-2 rounded-full bg-primary' />
                  )}
                </div>

                <p
                  className='
mt-2
line-clamp-2
text-sm
text-muted-foreground
'>
                  {note.message}
                </p>

                <small className='mt-2 block text-muted-foreground'>
                  {new Date(note.createdAt).toLocaleString()}
                </small>

                {active === note._id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className='
mt-4
rounded-xl
border
border-border/40
bg-background/50
p-3
text-sm
'>
                    <strong>Notification Details</strong>

                    <p className='mt-2 text-muted-foreground'>{note.message}</p>

                    {note.incident && (
                      <Link
                        to={`/incidents/${note.incident._id}`}
                        className='
mt-3
block
font-medium
text-primary
hover:underline
'>
                        Open related incident →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
