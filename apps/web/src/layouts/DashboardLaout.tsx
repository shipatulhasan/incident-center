import { Bell, LayoutDashboard, LogOut, ShieldCheck, Users } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {

    // don't scroll dashboard page
    if (pathname === "/") return;


    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });


  }, [pathname]);

  return (
    <div className=' relative min-h-screen overflow-hidden bg-background'>
      {/* Background */}
      <div className='absolute inset-0 z-0 pointer-events-none'>
        {/* Grid */}
        <div className='dashboard-grid absolute inset-0' />

        {/* Glows */}
        <div className='absolute -left-52 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-400/18 blur-3xl' />

        <div className='absolute -right-52 -top-20 h-[450px] w-[450px] rounded-full bg-pink-500/16 blur-3xl' />

        {/* Fade */}
        <div
          className='absolute inset-0'
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, transparent 70%, var(--background) 100%)'
          }}
        />
      </div>

      <div className='relative z-20'>
        {/* ========= Hero ========= */}

        <header className='relative overflow-hidden'>
          {/* Topography Pattern */}

          <div className='container relative mx-auto px-6 py-14'>
            <div className='flex flex-col items-center text-center'>
              <div className='mb-4 flex items-center gap-1 text-4xl font-black tracking-tight'>
                <span className='text-primary'>/</span>
                <span>IncidentCenter</span>
              </div>

              <span className='mb-3 text-xs font-bold uppercase tracking-[0.6em] text-primary'>
                INCIDENT OPS
              </span>

              <h1 className='bg-linear-to-r from-primary via-brand to-pink-600 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-7xl'>
                Reliability Command Center
              </h1>

              <p className='mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl'>
                Don't let incidents stay open. Detect early, respond quickly,
                resolve confidently.
              </p>

              <nav className='mt-10 flex flex-wrap items-center justify-center gap-3'>
                <NavLink to='/' end>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? 'default' : 'outline'}
                      className={cn(
                        'glass-control gap-2 transition-all hover:bg-brand hover:text-white',
                        isActive &&
                          'border-brand/40 bg-brand text-white shadow-lg shadow-brand/20'
                      )}>
                      <LayoutDashboard className='size-4' />
                      Dashboard
                    </Button>
                  )}
                </NavLink>

                <NavLink to='/team'>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? 'default' : 'outline'}
                      className={cn(
                        'glass-control gap-2 transition-all hover:bg-brand hover:text-white',
                        isActive &&
                          'border-brand/40 bg-brand text-white shadow-lg shadow-brand/20'
                      )}>
                      <Users className='size-4' />
                      On-Call Team
                    </Button>
                  )}
                </NavLink>

                <Button
                  variant='outline'
                  onClick={logout}
                  className='glass-control gap-2 hover:bg-brand hover:text-white'>
                  <LogOut className='size-4' />
                  Logout
                </Button>

                <ThemeToggle />
              </nav>
            </div>
          </div>
        </header>

        {/* ========= Content ========= */}

        <main className='container mx-auto space-y-8 px-6 py-8'>
          <Card className='glass-panel glass-panel-strong ring-0'>
            <div className='absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/8 blur-3xl' />

            <CardContent className='relative p-8'>
              <div className='space-y-3'>
                <span className='text-xs font-bold uppercase tracking-[0.5em] text-primary'>
                  Incident Management
                </span>

                <h2 className='text-3xl font-bold'>Remember your SLA!</h2>

                <p className='text-muted-foreground'>
                  Detect fast, respond faster, resolve like a professional.
                </p>
              </div>
            </CardContent>
          </Card>

          <div ref={ref} className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-center gap-2 text-sm'>
              <ShieldCheck className='size-4 text-primary' />

              <span className='text-muted-foreground'>Signed in as</span>

              <span className='font-semibold'>{user?.name}</span>
            </div>

            <Button variant='outline' size='icon' className='glass-control'>
              <Bell className='size-5' />
            </Button>
          </div>

          {/* <Separator className="bg-border/60" /> */}

          
            <Outlet />
          
        </main>
      </div>
    </div>
  )
}
