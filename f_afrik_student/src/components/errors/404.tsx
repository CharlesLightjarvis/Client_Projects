import { Link } from '@tanstack/react-router'
import { Home, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function NotFound404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-2 shadow-2xl">
          <div className="p-8 md:p-12 text-center space-y-8">
            {/* 404 Animation */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl animate-pulse" />
              </div>
              <div className="relative flex items-center justify-center space-x-2">
                <span className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-bounce">
                  4
                </span>
                <div className="relative">
                  <AlertCircle
                    className="w-24 h-24 text-blue-600 dark:text-blue-400 animate-spin"
                    style={{ animationDuration: '3s' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-md" />
                  </div>
                </div>
                <span
                  className="text-9xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                >
                  4
                </span>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Page introuvable
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Oups ! La page que vous recherchez semble avoir disparu dans le
                cyberespace.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Vérifiez l'URL ou retournez à la page d'accueil.
              </p>
            </div>

            {/* Main Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Floating Elements */}
        <div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDuration: '3s' }}
        />
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDuration: '4s', animationDelay: '1s' }}
        />
      </div>
    </div>
  )
}
