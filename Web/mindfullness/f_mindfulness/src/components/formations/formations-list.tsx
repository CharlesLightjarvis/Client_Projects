import * as React from 'react'
import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/optics/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  Brain,
  Clock,
  Flower2,
  Gem,
  Heart,
  Leaf,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'
import { Input } from '@/components/ui/input'

export const allCourses = [
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
      'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=800&auto=format&fit=crop',
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
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=800&auto=format&fit=crop',
    desc: 'Découvrez le pouvoir vibratoire des pierres et comment les utiliser au quotidien.',
    lessons: 10,
    students: 280,
    price: '99€',
    duration: '5 semaines',
  },
  {
    id: 'meditation-advanced',
    title: 'Méditation Avancée & Visualisation',
    category: 'Mental',
    icon: Sparkles,
    image:
      'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=800&auto=format&fit=crop',
    desc: 'Approfondissez votre pratique méditative avec des techniques de visualisation créatrice.',
    lessons: 18,
    students: 210,
    price: '149€',
    duration: '10 semaines',
  },
  {
    id: 'yoga-breathwork',
    title: 'Yoga & Respiration Consciente',
    category: 'Corps',
    icon: Flower2,
    image:
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop',
    desc: 'Unifiez corps et esprit à travers des postures et des exercices de pranayama.',
    lessons: 20,
    students: 580,
    price: '109€',
    duration: '8 semaines',
  },
  {
    id: 'aromatherapy',
    title: 'Aromathérapie & Huiles Essentielles',
    category: 'Nature',
    icon: Leaf,
    image:
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=800&auto=format&fit=crop',
    desc: 'Maîtrisez les bienfaits des huiles essentielles pour le bien-être physique et émotionnel.',
    lessons: 14,
    students: 390,
    price: '119€',
    duration: '7 semaines',
  },
  {
    id: 'self-compassion',
    title: 'Auto-compassion & Guérison Intérieure',
    category: 'Émotionnel',
    icon: Heart,
    image:
      'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop',
    desc: 'Développez la bienveillance envers vous-même et libérez les blocages émotionnels.',
    lessons: 10,
    students: 260,
    price: '79€',
    duration: '5 semaines',
  },
  {
    id: 'energy-healing',
    title: 'Soins Énergétiques & Reiki',
    category: 'Énergie',
    icon: Activity,
    image:
      'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?q=80&w=800&auto=format&fit=crop',
    desc: 'Initiez-vous aux techniques de soin énergétique pour vous-même et pour les autres.',
    lessons: 16,
    students: 175,
    price: '159€',
    duration: '9 semaines',
  },
]

const categories = ['Tous', 'Mental', 'Énergie', 'Nature', 'Corps', 'Émotionnel']

export function FormationsList() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState('Tous')

  const filtered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return allCourses.filter((course) => {
      if (activeCategory !== 'Tous' && course.category !== activeCategory)
        return false
      if (q) {
        const searchable = [course.title, course.desc, course.category]
          .join(' ')
          .toLowerCase()
        if (!searchable.includes(q)) return false
      }
      return true
    })
  }, [searchQuery, activeCategory])

  return (
    <div className="min-h-screen text-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            Nos Formations
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Toutes nos{' '}
            <span className="text-indigo-500 italic">formations</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            Explorez l'ensemble de nos programmes pour éveiller votre
            conscience, harmoniser vos énergies et transformer votre quotidien.
          </p>
        </motion.div>

        {/* Search + Category filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Rechercher une formation..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              className="shrink-0 rounded-full"
              size="sm"
              variant={activeCategory === cat ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                Aucune formation trouvée.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('Tous')
                }}
                className="mt-2"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}

          {filtered.map((course, idx) => {
            const IconComponent = course.icon
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Card decorations className="group h-full">
                  {/* Image */}
                  <div className="relative h-96 overflow-hidden -mt-4 -mx-px">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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

                  <Link to="/formations/$formationId" params={{ formationId: course.id }}>
                    <Button className="w-full gap-2 group/btn" size="sm">
                      Découvrir la formation
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
