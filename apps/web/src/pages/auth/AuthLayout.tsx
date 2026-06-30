import { Button } from '@/components/ui/button';
import { Outlet, useLocation } from 'react-router';
import star from '../../assets/images/authStar.png';
import star2 from '../../assets/images/authStar2.png';

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
     <div className='min-h-svh overflow-x-hidden overflow-y-auto bg-[#09090B] sm:min-h-screen sm:overflow-hidden'>
      <div className='relative flex min-h-svh flex-col items-center overflow-hidden border border-white/10 bg-[#0B1020] px-4 py-6 sm:h-screen sm:min-h-0 sm:justify-center sm:rounded-3xl sm:px-0 sm:py-0'>
        <div
          className={`absolute -top-60 h-[55vh] w-[80vw] rounded-full bg-cyan-300/30 blur-3xl sm:-top-110 ${glowHeight} sm:w-[36vw]`}
        />

        {/* Noise */}
        <div className="absolute inset-0 opacity-20 mix-blend-soft-light bg-[url('/src/assets/images/bg.png')]" />

        {/* Logo */}
        <div className='absolute left-5 top-5 sm:left-10 sm:top-10'>
          {/* <img
            src={logo}
            alt='logo'
            className='w-28 object-contain sm:w-36'
          /> */}
        </div>

        {/* Stars */}
        <div className='absolute right-0 top-0'>
          <img
            src={star}
            alt='star'
            className='w-24 object-contain sm:w-36'
          />
        </div>
        <div className='absolute left-0 bottom-0'>
          <img
            src={star2}
            alt='star'
            className='w-24 object-contain sm:w-36'
          />
        </div>

        {/* Dynamic Bottom Left */}
        {/* {(isLoginPage ||
          isRegisterPage ||
          isForgotPasswordPage ||
          isResetPasswordPage ||
          isVerifyEmailPage ||
          isAcceptInvitationPage) && (
          <div className='relative z-50 order-3 mt-6 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-center text-sm sm:absolute sm:left-28 sm:bottom-16 sm:mt-0 sm:flex-nowrap sm:justify-start sm:text-left sm:text-base'>
            {isLoginPage && (
              <>
                <p className='text-white'>Don't have an account?</p>
                <Link to='/auth/signup'>
                  <Button
                    variant='link'
                    className='text-brand'>
                    Register
                  </Button>
                </Link>
              </>
            )}
            {isRegisterPage && (
              <>
                <p className='text-white'>Already have an account?</p>
                <Link to='/auth/login'>
                  <Button
                    variant='link'
                    className='text-brand'>
                    Login
                  </Button>
                </Link>
              </>
            )}
            {isForgotPasswordPage && (
              <>
                <p className='text-white'>Remember your password?</p>
                <Link to='/auth/login'>
                  <Button
                    variant='link'
                    className='text-brand'>
                    Sign in
                  </Button>
                </Link>
              </>
            )}
            {isResetPasswordPage && (
              <>
                <p className='text-white'>Remember your password?</p>
                <Link to='/auth/login'>
                  <Button
                    variant='link'
                    className='text-brand'>
                    Sign in
                  </Button>
                </Link>
              </>
            )}
            {isVerifyEmailPage && (
              <>
                <p className='text-white'>Wrong email or need a new account?</p>
                <Link to='/auth/signup'>
                  <Button
                    variant='link'
                    className='text-brand'>
                    Sign up
                  </Button>
                </Link>
              </>
            )}
            {isAcceptInvitationPage && (
              <>
                <p className='text-white'>Already have an account?</p>
                <Link to='/auth/login'>
                  <Button
                    variant='link'
                    className='text-brand'>
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </div>
        )} */}

        {/* Bottom Right */}
        <div className='relative z-50 order-4 mb-2 mt-2 text-center sm:absolute sm:right-10 sm:bottom-16 sm:mb-0 sm:mt-0'>
          <Button
            
            variant='link'
            className='text-brand'>
            <a href='mailto:dj@thegoodgoodlabs.com?subject=Support Request'>
              Contact Support
            </a>
          </Button>
        </div>
        {/* Page content */}
        <div className='relative z-50 order-2 flex w-full flex-1 items-center justify-center pt-24 sm:absolute sm:left-1/2 sm:top-1/2 sm:w-full  sm:-translate-x-1/2 sm:-translate-y-1/2 sm:transform sm:pt-0'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;