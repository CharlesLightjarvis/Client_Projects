'use client'
import React from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MenuToggleIcon } from '@/components/menu-toggle-icon'
import { useScroll } from '@/components/use-scroll'
import { ModeToggle } from './mode-toggle'
import logoTypo from '../../assets/logo-typo.png'
import { Link } from '@tanstack/react-router'

export function Header() {
  const [open, setOpen] = React.useState(false)
  const scrolled = useScroll(10)

  const links = [
    {
      label: 'Nos Formations',
      href: '/formations',
    },
  ]

  React.useEffect(() => {
    if (open) {
      // Disable scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Re-enable scroll
      document.body.style.overflow = ''
    }

    // Cleanup when component unmounts (important for Next.js)
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'sticky z-50 mx-auto w-full max-w-4xl border border-border rounded-md bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg shadow md:transition-all md:ease-out',
        {
          'top-4': scrolled && !open,
          'top-4 mt-4': !scrolled && !open,
          'top-0 bg-background/90': open,
        },
      )}
    >
      <nav
        className={cn(
          'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
          {
            'md:px-2': scrolled,
          },
        )}
      >
        <Link to="/" className="flex items-center">
          <img src={logoTypo} alt="Mindfulness Studio" className="h-60 pt-2" />
        </Link>
        <div className="hidden items-center gap-2 md:flex ">
          {links.map((link, i) => (
            <a
              key={i}
              className={buttonVariants({ variant: 'link' })}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <Button variant="outline">S'inscrire</Button>
          <Button>Commencer</Button>
          <ModeToggle />
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      <div
        className={cn(
          'bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
            'flex h-full w-full flex-col justify-between gap-y-2 p-4',
          )}
        >
          <div className="grid gap-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                className={buttonVariants({
                  variant: 'ghost',
                  className: 'justify-start',
                })}
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
