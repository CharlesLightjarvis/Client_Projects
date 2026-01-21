import { Header } from '@/components/header'
import { Footer } from '@/components/modem-animated-footer'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'
import logo from '../../../assets/logo.png'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

const socialLinks = [
  {
    icon: <Twitter className="w-6 h-6" />,
    href: 'https://twitter.com',
    label: 'Twitter',
  },
  {
    icon: <Linkedin className="w-6 h-6" />,
    href: 'https://linkedin.com',
    label: 'LinkedIn',
  },
  {
    icon: <Github className="w-6 h-6" />,
    href: 'https://github.com',
    label: 'GitHub',
  },
  {
    icon: <Mail className="w-6 h-6" />,
    href: 'mailto:contact@resumegpt.com',
    label: 'Email',
  },
]

const navLinks = [
  { label: 'Accueil', href: '#' },
  { label: 'Nos Formations', href: '#' },
  { label: 'À Propos', href: '#' },
  { label: 'Contact', href: '#' },
]

function RouteComponent() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer
        brandName="Mindfulness Studio"
        brandDescription="Votre destination pour un éveil de conscience, un rééquilibrage énergétique et une vie plus sereine."
        socialLinks={socialLinks}
        navLinks={navLinks}
        creatorName="Deepak Modi"
        creatorUrl="https://deepakmodi.tech"
        brandIcon={
          <img src={logo} alt="Mindfulness Studio" className="w-full h-full object-contain" />
        }
      />
    </>
  )
}
