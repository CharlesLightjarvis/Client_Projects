import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Play,
  Star,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/optics/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { allCourses } from './formations-list'

// Mock detailed data for each course
const courseDetails: Record<
  string,
  {
    longDescription: string
    objectives: string[]
    modules: { title: string; lessons: number; duration: string }[]
    instructor: {
      name: string
      role: string
      avatar?: string
      bio: string
    }
    rating: number
    reviews: number
    level: string
  }
> = {
  'mindfulness-101': {
    longDescription:
      "Cette formation vous guide pas à pas dans la pratique de la pleine conscience. Vous apprendrez à observer vos pensées sans jugement, à ancrer votre attention dans le moment présent et à développer une relation plus sereine avec vos émotions. Chaque module combine théorie, exercices pratiques et méditations guidées pour une intégration progressive dans votre quotidien.",
    objectives: [
      'Comprendre les fondements scientifiques de la pleine conscience',
      'Pratiquer la méditation de pleine conscience au quotidien',
      'Gérer le stress et l\'anxiété avec des techniques éprouvées',
      'Développer une attention soutenue et une présence accrue',
      'Intégrer la mindfulness dans vos relations et votre travail',
    ],
    modules: [
      { title: 'Introduction à la Pleine Conscience', lessons: 3, duration: '45 min' },
      { title: 'L\'attention au souffle', lessons: 2, duration: '30 min' },
      { title: 'Le scan corporel', lessons: 2, duration: '35 min' },
      { title: 'Observer ses pensées', lessons: 3, duration: '50 min' },
      { title: 'La gestion du stress', lessons: 2, duration: '40 min' },
    ],
    instructor: {
      name: 'Sophie Delacroix',
      role: 'Instructrice certifiée MBSR',
      bio: 'Formée à l\'université de Massachusetts, Sophie pratique et enseigne la pleine conscience depuis 12 ans.',
    },
    rating: 4.8,
    reviews: 127,
    level: 'Débutant',
  },
  'chakras-energy': {
    longDescription:
      "Explorez le système des chakras et apprenez à identifier, comprendre et rééquilibrer vos centres énergétiques. Cette formation allie connaissances traditionnelles et approches modernes pour vous permettre de retrouver harmonie et vitalité au quotidien.",
    objectives: [
      'Identifier et localiser les 7 chakras principaux',
      'Comprendre le rôle de chaque centre énergétique',
      'Détecter les déséquilibres énergétiques',
      'Pratiquer des exercices de rééquilibrage',
      'Intégrer les soins énergétiques dans votre routine',
    ],
    modules: [
      { title: 'Les fondements de l\'énergie subtile', lessons: 3, duration: '50 min' },
      { title: 'Chakra Racine & Sacré', lessons: 3, duration: '45 min' },
      { title: 'Plexus Solaire & Cœur', lessons: 3, duration: '45 min' },
      { title: 'Gorge, 3ème Œil & Couronne', lessons: 3, duration: '50 min' },
      { title: 'Pratiques d\'harmonisation globale', lessons: 3, duration: '55 min' },
    ],
    instructor: {
      name: 'Marc Lefèvre',
      role: 'Énergéticien & Formateur',
      bio: 'Praticien en soins énergétiques depuis 15 ans, Marc accompagne les personnes vers un meilleur équilibre intérieur.',
    },
    rating: 4.7,
    reviews: 89,
    level: 'Intermédiaire',
  },
  'lithotherapy-base': {
    longDescription:
      "Plongez dans l'univers fascinant des minéraux et découvrez comment les pierres peuvent soutenir votre bien-être physique et émotionnel. Cette formation vous apprendra à choisir, purifier, programmer et utiliser les cristaux au quotidien.",
    objectives: [
      'Reconnaître les principales pierres et leurs propriétés',
      'Purifier et recharger vos cristaux correctement',
      'Choisir les pierres adaptées à vos besoins',
      'Créer des élixirs et des grilles de cristaux',
      'Intégrer la lithothérapie dans votre pratique bien-être',
    ],
    modules: [
      { title: 'Introduction à la Lithothérapie', lessons: 2, duration: '30 min' },
      { title: 'Les pierres essentielles', lessons: 3, duration: '45 min' },
      { title: 'Purification & Rechargement', lessons: 2, duration: '25 min' },
      { title: 'Applications pratiques', lessons: 3, duration: '40 min' },
    ],
    instructor: {
      name: 'Claire Moreau',
      role: 'Lithothérapeute certifiée',
      bio: 'Passionnée par le monde minéral depuis son enfance, Claire partage son savoir avec douceur et rigueur.',
    },
    rating: 4.9,
    reviews: 95,
    level: 'Débutant',
  },
  'meditation-advanced': {
    longDescription:
      "Destinée aux pratiquants ayant déjà une base en méditation, cette formation vous emmène plus loin avec des techniques avancées de visualisation créatrice, de méditation transcendantale et d'exploration de la conscience.",
    objectives: [
      'Maîtriser les techniques de visualisation créatrice',
      'Approfondir les états méditatifs prolongés',
      'Explorer la méditation transcendantale',
      'Développer l\'intuition par la pratique',
      'Créer vos propres séquences de méditation',
    ],
    modules: [
      { title: 'Au-delà de la méditation de base', lessons: 3, duration: '45 min' },
      { title: 'La visualisation créatrice', lessons: 4, duration: '60 min' },
      { title: 'Méditation transcendantale', lessons: 4, duration: '55 min' },
      { title: 'États modifiés de conscience', lessons: 3, duration: '50 min' },
      { title: 'Créer sa pratique personnelle', lessons: 4, duration: '65 min' },
    ],
    instructor: {
      name: 'Antoine Rivière',
      role: 'Maître de méditation',
      bio: 'Formé en Inde et au Japon, Antoine guide des retraites de méditation depuis plus de 20 ans.',
    },
    rating: 4.9,
    reviews: 64,
    level: 'Avancé',
  },
  'yoga-breathwork': {
    longDescription:
      "Cette formation complète associe les postures de yoga (asanas) aux exercices de respiration consciente (pranayama) pour créer une pratique unifiée du corps et de l'esprit. Accessible à tous les niveaux.",
    objectives: [
      'Maîtriser les postures fondamentales du yoga',
      'Pratiquer les principales techniques de pranayama',
      'Créer des séquences adaptées à vos besoins',
      'Comprendre la philosophie du yoga',
      'Développer souplesse, force et sérénité',
    ],
    modules: [
      { title: 'Fondements du Yoga', lessons: 4, duration: '55 min' },
      { title: 'Asanas essentielles', lessons: 5, duration: '70 min' },
      { title: 'Introduction au Pranayama', lessons: 4, duration: '50 min' },
      { title: 'Séquences & Flows', lessons: 4, duration: '60 min' },
      { title: 'Intégration corps-esprit', lessons: 3, duration: '45 min' },
    ],
    instructor: {
      name: 'Léa Fontaine',
      role: 'Professeure de Yoga certifiée RYT-500',
      bio: 'Léa enseigne le yoga depuis 10 ans et se spécialise dans l\'union du mouvement et de la respiration.',
    },
    rating: 4.8,
    reviews: 203,
    level: 'Tous niveaux',
  },
  'aromatherapy': {
    longDescription:
      "Apprenez à utiliser les huiles essentielles de manière sûre et efficace pour soutenir votre santé physique et émotionnelle. Cette formation couvre les bases de l'aromathérapie jusqu'aux applications avancées.",
    objectives: [
      'Connaître les 20 huiles essentielles indispensables',
      'Comprendre les modes d\'utilisation et les précautions',
      'Créer vos propres synergies aromatiques',
      'Utiliser les huiles pour le bien-être émotionnel',
      'Intégrer l\'aromathérapie dans votre quotidien',
    ],
    modules: [
      { title: 'Bases de l\'Aromathérapie', lessons: 3, duration: '40 min' },
      { title: 'Les huiles essentielles clés', lessons: 4, duration: '55 min' },
      { title: 'Modes d\'utilisation', lessons: 3, duration: '35 min' },
      { title: 'Synergies & Recettes', lessons: 4, duration: '50 min' },
    ],
    instructor: {
      name: 'Nathalie Blanc',
      role: 'Aromathérapeute & Naturopathe',
      bio: 'Nathalie allie naturopathie et aromathérapie pour une approche holistique du bien-être.',
    },
    rating: 4.7,
    reviews: 112,
    level: 'Débutant',
  },
  'self-compassion': {
    longDescription:
      "Cette formation vous invite à cultiver la bienveillance envers vous-même. À travers des pratiques douces et profondes, vous apprendrez à transformer votre dialogue intérieur et à libérer les schémas émotionnels limitants.",
    objectives: [
      'Comprendre les bases de l\'auto-compassion',
      'Identifier et transformer le critique intérieur',
      'Pratiquer la bienveillance envers soi',
      'Libérer les blocages émotionnels anciens',
      'Développer la résilience émotionnelle',
    ],
    modules: [
      { title: 'Qu\'est-ce que l\'auto-compassion ?', lessons: 2, duration: '30 min' },
      { title: 'Le critique intérieur', lessons: 3, duration: '40 min' },
      { title: 'Pratiques de bienveillance', lessons: 3, duration: '45 min' },
      { title: 'Guérison des blessures émotionnelles', lessons: 2, duration: '35 min' },
    ],
    instructor: {
      name: 'Camille Durand',
      role: 'Psychologue & Thérapeute',
      bio: 'Camille accompagne les personnes vers plus de douceur intérieure depuis 8 ans.',
    },
    rating: 4.9,
    reviews: 78,
    level: 'Débutant',
  },
  'energy-healing': {
    longDescription:
      "Initiez-vous aux techniques de soins énergétiques et au Reiki. Cette formation vous donne les outils pour canaliser l'énergie universelle afin de favoriser la guérison et l'équilibre, pour vous-même et pour les autres.",
    objectives: [
      'Comprendre les principes du soin énergétique',
      'Ressentir et canaliser l\'énergie',
      'Pratiquer les positions de Reiki niveau 1',
      'Réaliser un soin complet sur soi-même',
      'Initier un soin pour une autre personne',
    ],
    modules: [
      { title: 'Fondements des soins énergétiques', lessons: 3, duration: '45 min' },
      { title: 'Ressentir l\'énergie', lessons: 3, duration: '40 min' },
      { title: 'Reiki niveau 1 : Auto-traitement', lessons: 4, duration: '55 min' },
      { title: 'Soins pour autrui', lessons: 3, duration: '50 min' },
      { title: 'Éthique & Pratique professionnelle', lessons: 3, duration: '40 min' },
    ],
    instructor: {
      name: 'Marc Lefèvre',
      role: 'Maître Reiki & Énergéticien',
      bio: 'Praticien en soins énergétiques depuis 15 ans, Marc accompagne les personnes vers un meilleur équilibre intérieur.',
    },
    rating: 4.6,
    reviews: 52,
    level: 'Débutant à Intermédiaire',
  },
}

interface FormationDetailProps {
  formationId: string
}

export function FormationDetail({ formationId }: FormationDetailProps) {
  const course = allCourses.find((c) => c.id === formationId)
  const details = courseDetails[formationId]

  if (!course || !details) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="mx-4 max-w-md">
          <CardContent className="p-6 text-center">
            <p className="mb-4 text-lg font-bold text-destructive">
              Formation introuvable
            </p>
            <p className="text-sm text-muted-foreground">
              Cette formation n'existe pas ou a été retirée.
            </p>
            <Link to="/formations">
              <Button className="mt-4" variant="outline">
                Retour aux formations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const IconComponent = course.icon

  return (
    <div className="min-h-screen text-foreground">
      <main className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="pt-6">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              to="/formations"
              className="font-medium text-muted-foreground hover:text-primary"
            >
              Formations
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{course.title}</span>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 gap-8 py-6 lg:grid-cols-12">
          {/* Left content */}
          <div className="flex flex-col gap-8 lg:col-span-8">
            {/* Hero image */}
            <div className="relative h-64 md:h-80 overflow-hidden rounded-2xl">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="secondary"
                    className="gap-1.5 backdrop-blur-sm bg-background/80"
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    {course.category}
                  </Badge>
                  <Badge className="backdrop-blur-sm bg-background/80 text-foreground">
                    {details.level}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                  {course.title}
                </h1>
              </div>
            </div>

            {/* Rating & Stats */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{details.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({details.reviews} avis)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{course.students} élèves inscrits</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>{course.lessons} leçons</span>
              </div>
            </div>

            {/* Description */}
            <section className="space-y-3">
              <h3 className="text-xl font-bold">À propos de cette formation</h3>
              <p className="text-muted-foreground leading-relaxed">
                {details.longDescription}
              </p>
            </section>

            {/* Objectives */}
            <section className="space-y-4">
              <h3 className="text-xl font-bold">Ce que vous apprendrez</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {details.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{obj}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section className="space-y-4">
              <h3 className="text-xl font-bold">Programme</h3>
              <div className="space-y-3">
                {details.modules.map((module, i) => (
                  <Card key={i} className="">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{module.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {module.lessons} leçons • {module.duration}
                            </p>
                          </div>
                        </div>
                        <Play className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Instructor */}
            <Card className="">
              <CardHeader className="">
                <h3 className="text-lg font-bold">Votre formatrice</h3>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-muted">
                    <AvatarImage src={details.instructor.avatar} />
                    <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                      {details.instructor.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{details.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {details.instructor.role}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {details.instructor.bio}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* CTA Card */}
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-black text-primary">
                      {course.price}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Accès à vie
                    </p>
                  </div>

                  <Button className="w-full gap-2 py-6 text-base font-bold">
                    S'inscrire à la formation
                  </Button>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Durée
                        </span>
                      </div>
                      <span className="text-sm font-bold">{course.duration}</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Leçons
                        </span>
                      </div>
                      <span className="text-sm font-bold">{course.lessons}</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Élèves
                        </span>
                      </div>
                      <span className="text-sm font-bold">{course.students}</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                      <div className="flex items-center gap-3">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Note
                        </span>
                      </div>
                      <span className="text-sm font-bold">
                        {details.rating}/5
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What's included */}
              <Card className="">
                <CardContent className="p-6">
                  <div className="mb-4 text-sm font-bold uppercase tracking-wider">
                    Inclus dans la formation
                  </div>
                  <div className="space-y-3">
                    {[
                      'Accès à vie au contenu',
                      'Méditations guidées audio',
                      'Support communautaire',
                      'Certificat de complétion',
                      'Mises à jour gratuites',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
