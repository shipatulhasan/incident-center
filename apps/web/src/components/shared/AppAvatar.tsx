import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getAvatarColor, getInitials } from '@/lib/avatar'
import { cn } from '@/lib/utils'
import { UserRound } from 'lucide-react'
type props = {
  user: string
}
const AppAvatar = ({ user }: props) => {
  return (
    <Avatar className='size-8'>
      <AvatarFallback className={cn('font-semibold', getAvatarColor(user))}>
        {user ? getInitials(user) : <UserRound className='size-4' />}
      </AvatarFallback>
    </Avatar>
  )
}

export default AppAvatar
