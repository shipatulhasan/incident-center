import { useMemo, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  users: TIUser[]
  onSubmit: (message: string) => void
}

export default function MentionCommentBox({ users, onSubmit }: Props) {
  const [comment, setComment] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const [mention, setMention] = useState({
    open: false,
    query: '',
    start: -1,
    end: -1,
    activeIndex: 0
  })

  const matches = useMemo(() => {
    if (!mention.open) return []

    return users
      .filter((u) =>
        `${u.name} ${u.email} ${u.team ?? ''} ${u.role ?? ''}`
          .toLowerCase()
          .includes(mention.query.toLowerCase())
      )
      .slice(0, 8)
  }, [mention, users])

  function detectMention(value: string, cursor: number) {
    const left = value.slice(0, cursor)

    const match = left.match(/(^|\s)@([\w.-]*)$/)

    if (!match) {
      setMention((prev) => ({
        ...prev,
        open: false
      }))

      return
    }

    const query = match[2] ?? ''

    setMention({
      open: true,

      query,

      start: cursor - query.length - 1,

      end: cursor,

      activeIndex: 0
    })
  }

  function selectUser(user: TIUser) {
    const text = `@${user.email} `

    const before = comment.slice(0, mention.start)

    const after = comment.slice(mention.end)

    const next = before + text + after

    setComment(next)

    setMention((p) => ({
      ...p,
      open: false
    }))

    requestAnimationFrame(() => {
      inputRef.current?.focus()

      inputRef.current?.setSelectionRange(
        before.length + text.length,

        before.length + text.length
      )
    })
  }

  function keyHandler(e: React.KeyboardEvent) {
    if (!mention.open || !matches.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()

      setMention((p) => ({
        ...p,
        activeIndex: (p.activeIndex + 1) % matches.length
      }))
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()

      setMention((p) => ({
        ...p,

        activeIndex: (p.activeIndex - 1 + matches.length) % matches.length
      }))
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()

      selectUser(matches[mention.activeIndex])
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    console.log(comment)

    if (!comment.trim()) return

    onSubmit(comment)

    setComment('')
  }

  return (
    <form onSubmit={submit} className='relative flex gap-3'>
      <div className='relative flex-1'>
        <Input
          ref={inputRef}
          value={comment}
          placeholder='Add update... type @ to mention'
          onChange={(e) => {
            const value = e.target.value

            setComment(value)

            detectMention(value, e.target.selectionStart ?? value.length)
          }}
          onKeyDown={keyHandler}
        />

        {mention.open && (
          <div
            className='
              absolute
              top-12
              z-50
              w-full
              overflow-hidden
              rounded-2xl
              border
              border-border/40
              bg-background/80
              shadow-2xl
              backdrop-blur-xl
              '>
            <div
                className='
                border-b
                px-4
                py-3
                text-xs
                font-bold
                uppercase
                tracking-widest
                text-muted-foreground
                '>
              Select teammate
            </div>

            {matches.length ? (
              matches.map((user, index) => (
                <button
                  key={user._id}
                  type='button'
                  onMouseDown={(e) => {
                    e.preventDefault()

                    selectUser(user)
                  }}
                  className={cn(
                    `
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      transition
                      hover:bg-primary/10
                      `,
                    index === mention.activeIndex && 'bg-primary/10'
                  )}>
                  <div
                    className='
                      flex
                      size-9
                      items-center
                      justify-center
                      rounded-full
                      bg-primary/15
                      font-bold
                      text-primary
                      '>
                    {user.name[0]}
                  </div>

                  <div>
                    <p className='font-medium'>{user.name}</p>

                    <p className='text-xs text-muted-foreground'>
                      {user.email}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className='p-4 text-center text-sm text-muted-foreground'>
                No user found
              </div>
            )}
          </div>
        )}
      </div>

      <Button type='submit'>Send</Button>
    </form>
  )
}
