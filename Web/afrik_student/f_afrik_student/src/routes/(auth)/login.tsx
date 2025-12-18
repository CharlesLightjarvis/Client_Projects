import { createFileRoute, redirect } from '@tanstack/react-router'
import { GalleryVerticalEnd } from 'lucide-react'
import z from 'zod'
import { LoginForm } from './-components/login-form'
import loginImage from '@/assets/p_pic.png'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: async ({ context }) => {
    const { isAuthenticated, isAdmin, isInstructor } = context
    if (isAuthenticated) {
      throw redirect({
        to: isAdmin ? '/admin' : isInstructor ? '/instructor' : '/student',
      })
    }
  },
})

function RouteComponent() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Afrik Student
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={loginImage}
          alt="AfrikStudent Login"
          className="absolute inset-0 h-full w-full object-cover "
        />
      </div>
    </div>
  )
}
