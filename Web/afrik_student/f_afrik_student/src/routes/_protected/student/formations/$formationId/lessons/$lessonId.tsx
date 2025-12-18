import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle2,
  Circle,
  Video,
  File,
  Image as ImageIcon,
  Monitor,
  FolderOpen,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFormations } from '@/hooks/use-formations'
import type { Lesson } from '@/types/lesson'

export const Route = createFileRoute(
  '/_protected/student/formations/$formationId/lessons/$lessonId',
)({
  component: LessonViewerPage,
})

// Helpers pour transformer les URLs externes en URLs "embed" lisibles dans un iframe

const getYoutubeEmbedUrl = (url: string) => {
  try {
    const u = new URL(url)

    // youtu.be/<id>
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`
    }

    // youtube.com/watch?v=<id>
    const v = u.searchParams.get('v')
    if (v) {
      return `https://www.youtube.com/embed/${v}`
    }

    // youtube.com/shorts/<id>
    if (u.pathname.startsWith('/shorts/')) {
      const parts = u.pathname.split('/')
      const id = parts[2]
      if (id) {
        return `https://www.youtube.com/embed/${id}`
      }
    }

    // fallback
    return url
  } catch {
    return url
  }
}

const getTikTokEmbedUrl = (url: string) => {
  try {
    const u = new URL(url)
    // ex: /@user/video/1234567890
    const parts = u.pathname.split('/')
    const videoIndex = parts.findIndex((p) => p === 'video')
    if (videoIndex !== -1 && parts[videoIndex + 1]) {
      const id = parts[videoIndex + 1]
      return `https://www.tiktok.com/embed/v2/${id}`
    }
    return url
  } catch {
    return url
  }
}

const getVimeoEmbedUrl = (url: string) => {
  try {
    const u = new URL(url)
    // ex: https://vimeo.com/12345678 -> https://player.vimeo.com/video/12345678
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      if (id) {
        return `https://player.vimeo.com/video/${id}`
      }
    }
    return url
  } catch {
    return url
  }
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Video className="h-5 w-5" />
    case 'image':
      return <ImageIcon className="h-5 w-5" />
    case 'youtube':
    case 'tiktok':
    case 'vimeo':
      return <Video className="h-5 w-5" />
    default:
      return <File className="h-5 w-5" />
  }
}

function LessonViewerPage() {
  const { lessonId, formationId } = Route.useParams()
  const { currentFormation, fetchFormation } = useFormations()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState('content')

  // Fetch formation if not loaded (e.g., on page refresh)
  useEffect(() => {
    if (!currentFormation || currentFormation.id !== formationId) {
      fetchFormation(formationId)
    }
  }, [formationId, currentFormation, fetchFormation])

  // Find lesson in current formation
  useEffect(() => {
    if (currentFormation?.modules) {
      for (const module of currentFormation.modules) {
        const foundLesson = module.lessons?.find((l) => l.id === lessonId)
        if (foundLesson) {
          setLesson(foundLesson as Lesson)
          break
        }
      }
    }
  }, [lessonId, currentFormation])

  const handleMarkAsComplete = () => {
    // TODO: Call API to mark lesson as complete
    setIsCompleted(true)
  }

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Leçon introuvable</p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => navigate({ to: '/student/formations' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux formations
          </Button>
        </div>
      </div>
    )
  }

  const internalFiles = lesson.attachments?.filter((a) => !a.is_external) ?? []
  const externalVideos =
    lesson.attachments?.filter(
      (a) => a.is_external && ['youtube', 'tiktok', 'vimeo'].includes(a.type),
    ) ?? []

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate({ to: `/student/formations/${formationId}` })
              }
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
              {currentFormation && (
                <p className="text-sm text-muted-foreground">
                  {currentFormation.title}
                </p>
              )}
            </div>
          </div>
          <Button
            variant={isCompleted ? 'outline' : 'default'}
            onClick={handleMarkAsComplete}
            disabled={isCompleted}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Terminé
              </>
            ) : (
              <>
                <Circle className="h-4 w-4 mr-2" />
                Marquer comme terminé
              </>
            )}
          </Button>
        </div>

        {/* Content with Tabs */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Ressources de la leçon</CardTitle>
            <CardDescription>
              Accédez au contenu, aux fichiers et aux vidéos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4 sm:px-6">
                <TabsList className="w-full grid grid-cols-3 h-10">
                  <TabsTrigger value="content" className="text-xs sm:text-sm">
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Contenu
                  </TabsTrigger>
                  <TabsTrigger value="files" className="text-xs sm:text-sm">
                    <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
                    Fichiers ({internalFiles.length})
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="text-xs sm:text-sm">
                    <Monitor className="h-3.5 w-3.5 mr-1.5" />
                    Vidéos ({externalVideos.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="mt-6 pb-6">
                {/* Tab: Contenu */}
                <TabsContent
                  value="content"
                  className="px-4 sm:px-6 space-y-4 m-0"
                >
                  {lesson.content ? (
                    <p className="whitespace-pre-line leading-relaxed text-base">
                      {lesson.content}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Aucun contenu disponible pour cette leçon.
                    </p>
                  )}
                </TabsContent>

                {/* Tab: Fichiers téléchargeables / internes */}
                <TabsContent value="files" className="px-4 sm:px-6 m-0">
                  <div className="space-y-4">
                    {internalFiles.length ? (
                      internalFiles.map((attachment) => (
                        <Card
                          key={attachment.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                {getFileIcon(attachment.type)}
                                <div>
                                  <p className="font-medium">
                                    {attachment.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {attachment.type.toUpperCase()}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDownload(
                                    attachment.url,
                                    attachment.name,
                                  )
                                }
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                            </div>

                            {/* Vidéo locale */}
                            {attachment.type === 'video' && (
                              <div className="mt-4">
                                <video
                                  controls
                                  className="w-full rounded-lg"
                                  src={attachment.url}
                                >
                                  Votre navigateur ne supporte pas la lecture de
                                  vidéos.
                                </video>
                              </div>
                            )}

                            {/* Image locale */}
                            {attachment.type === 'image' && (
                              <div className="mt-4">
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  className="w-full rounded-lg"
                                />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucun fichier téléchargeable pour cette leçon.
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* Tab: Vidéos externes (YouTube, TikTok, Vimeo) */}
                <TabsContent value="videos" className="px-4 sm:px-6 m-0">
                  <div className="space-y-6">
                    {externalVideos.length ? (
                      externalVideos.map((attachment) => {
                        let embedUrl = attachment.url
                        if (attachment.type === 'youtube') {
                          embedUrl = getYoutubeEmbedUrl(attachment.url)
                        } else if (attachment.type === 'tiktok') {
                          embedUrl = getTikTokEmbedUrl(attachment.url)
                        } else if (attachment.type === 'vimeo') {
                          embedUrl = getVimeoEmbedUrl(attachment.url)
                        }

                        return (
                          <div key={attachment.id} className="space-y-3">
                            <div className="flex items-center gap-2">
                              {getFileIcon(attachment.type)}
                              <span className="font-medium">
                                {attachment.name}
                              </span>
                              <Badge variant="secondary">
                                {attachment.type}
                              </Badge>
                            </div>
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted border">
                              <iframe
                                width="100%"
                                height="100%"
                                src={embedUrl}
                                title={attachment.name}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucune vidéo externe pour cette leçon.
                      </p>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LessonViewerPage
