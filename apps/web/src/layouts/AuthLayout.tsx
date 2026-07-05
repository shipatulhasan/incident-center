import { Button } from '@/components/ui/button'
import { Outlet, useLocation } from 'react-router'
import star from '../assets/images/authStar.png'
import star2 from '../assets/images/authStar2.png'
import { ShieldCheck } from 'lucide-react'

const AuthLayout = () => {
  const location = useLocation()
  const page = location.pathname
  const glowHeight = page.includes('/login')
    ? 'sm:h-[75vh]'
    : page.includes('/signup')
      ? 'sm:h-[90vh]'
      : page.includes('/reset-password') ||
          page.includes('/forgot-password') ||
          page.includes('/invite')
        ? 'sm:h-[75vh]'
        : page.includes('/verify-email')
          ? 'sm:h-[75vh]'
          : 'sm:h-[40vh]'
  return (
    <div className='relative min-h-screen overflow-hidden bg-background text-foreground'>
      {/* ================= Background ================= */}

      <div className='absolute inset-0 pointer-events-none'>
        {/* Grid */}
        <div className='dashboard-grid absolute inset-0' />

        {/* Cyan Glow */}
        <div
          className='
            absolute
            -left-52
            -top-40
            h-[550px]
            w-[550px]
            rounded-full
            bg-cyan-400/18
            blur-3xl
          '
        />

        {/* Pink Glow */}
        <div
          className='
            absolute
            -right-52
            top-20
            h-[500px]
            w-[500px]
            rounded-full
            bg-pink-500/16
            blur-3xl
          '
        />

        {/* Center Glow */}
        <div
          className='
            absolute
            left-1/2
            top-1/2
            h-[450px]
            w-[450px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-primary/10
            blur-3xl
          '
        />

        {/* Fade */}
        <div
          className='
            absolute
            inset-0
            bg-linear-to-b
            from-transparent
            via-background/10
            to-background
          '
        />
      </div>

      {/* ================= Header Logo ================= */}

      <div
        className='
    absolute
    left-6
    top-6
    z-20
    flex
    items-center
    gap-1
    bg-linear-to-r
    from-primary
    to-slate-400
    bg-clip-text
    text-2xl
    font-black
    text-transparent
  '>
        <span>/</span>

        <span>IncidentCenter</span>
      </div>

      {/* ================= Auth Card ================= */}

      <main
        className='
          relative
          rounded-md
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
        '>
        <div
          className='
            glass-panel
            glass-panel-strong
            relative
            w-full
            max-w-md
            rounded-2xl
            overflow-hidden
            p-8
            md:p-10
          '>
          {/* card glow */}

          <div
            className='
              absolute
              -right-20
              -top-20
              h-48
              w-48
              rounded-full
              bg-primary/15
              blur-3xl
            '
          />

          {/* Icon */}

          <div
            className='
              relative
              mb-8
              flex
              flex-col
              items-center
              text-center
            '>
            <div
              className='
                mb-4
                flex
                size-16
                items-center
                justify-center
                rounded-2xl
                border
                border-primary/20
                bg-primary/10
                shadow-lg
                shadow-primary/10
              '>
              <ShieldCheck className='size-8 text-primary' />
            </div>

            <span
              className='
                text-xs
                font-bold
                uppercase
                tracking-[0.45em]
                text-primary
              '>
              INCIDENT OPS
            </span>

            <h1
              className='
                mt-3
                bg-linear-to-r
                from-primary
                via-brand
                to-pink-600
                bg-clip-text
                text-3xl
                font-black
                text-transparent
              '>
              Command Access
            </h1>

            <p className='mt-2 text-sm text-muted-foreground'>
              Authenticate to continue monitoring reliability
            </p>
          </div>

          {/* Login/Register Pages */}

          <div className='relative z-10'>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
