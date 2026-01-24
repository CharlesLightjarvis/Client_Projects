import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/optics/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Activity, ArrowRight, Brain, Clock, Gem, Users } from 'lucide-react'

export const courses = [
  {
    id: 'mindfulness-101',
    title: 'Mindfulness & Pleine Conscience',
    category: 'Mental',
    icon: Brain,
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    desc: "Apprenez à vivre l'instant présent et à gérer votre stress avec des techniques éprouvées.",
    lessons: 12,
    students: 450,
    price: '89€',
    duration: '6 semaines',
  },
  {
    id: 'chakras-energy',
    title: 'Chakras & Équilibrage Énergétique',
    category: 'Énergie',
    icon: Activity,
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    desc: "Harmonisez vos centres d'énergie pour retrouver vitalité et paix intérieure.",
    lessons: 15,
    students: 320,
    price: '129€',
    duration: '8 semaines',
  },
  {
    id: 'lithotherapy-base',
    title: 'Lithothérapie & Minéraux',
    category: 'Nature',
    icon: Gem,
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    desc: 'Découvrez le pouvoir vibratoire des pierres et comment les utiliser au quotidien.',
    lessons: 10,
    students: 280,
    price: '99€',
    duration: '5 semaines',
  },
]

interface FormationsGridProps {
  onCourseClick?: (course: (typeof courses)[0]) => void
}

export const FormationsGrid: React.FC<FormationsGridProps> = ({
  onCourseClick,
}) => {
  const navigate = useNavigate()

  return (
    <section
      id="formations"
      className="py-20 md:py-28 relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8"
        >
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4">
              Nos Formations
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-4">
              Éveillez votre{' '}
              <span className="text-indigo-500 italic">potentiel</span>{' '}
              intérieur
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Explorez nos programmes conçus par des experts pour transformer
              votre conscience et harmoniser vos énergies.
            </p>
          </div>
          <Button
            variant="outline"
            className="self-start lg:self-auto gap-2"
            onClick={() => navigate({ to: '/formations' })}
          >
            Voir toutes les formations
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => {
            const IconComponent = course.icon
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card decorations className="group h-full">
                  {/* Image with shading */}
                  <div className="relative h-96 overflow-hidden -mt-4 -mx-px">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient shading at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className="gap-1.5 backdrop-blur-sm bg-background/80"
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        {course.category}
                      </Badge>
                    </div>

                    {/* Price */}
                    <div className="absolute top-3 right-3">
                      <Badge className="font-bold">{course.price}</Badge>
                    </div>
                  </div>

                  <CardHeader className="">
                    <CardTitle className="text-base font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {course.desc}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{course.students} élèves</span>
                      </div>
                    </div>
                  </CardContent>

                  <Button
                    onClick={() => onCourseClick?.(course)}
                    className="w-full gap-2 group/btn"
                    size="sm"
                  >
                    Découvrir la formation
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
