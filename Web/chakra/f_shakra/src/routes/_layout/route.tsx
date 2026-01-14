import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Github, Linkedin, Mail, Twitter, User } from 'lucide-react'

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
  { label: 'Pricing', href: '/' },
  { label: 'Templates', href: '/' },
  { label: 'About', href: '/' },
  { label: 'Contact', href: '/' },
]

function RouteComponent() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer
        brandName="ResumeGPT"
        brandDescription="AI-powered resume builder for modern professionals. Create stunning resumes optimized for ATS systems."
        socialLinks={socialLinks}
        navLinks={navLinks}
        creatorName="Deepak Modi"
        creatorUrl="https://deepakmodi.tech"
        brandIcon={
          <User className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-background drop-shadow-lg" />
        }
      />
    </>
  )
}
