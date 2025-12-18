import { motion } from "framer-motion";
import { Award, CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import { Footer } from "~/components/footer";
import { MainNav } from "~/components/main-nav";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import istqbLogo from "~/assets/istqb-logo.png";

const certifications = {
  devops: [
    {
      id: 1,
      title: "AWS Certified DevOps Engineer - Professional", // name dans la BD
      //
      description:
        "Validez vos compétences en matière d'automatisation, de sécurité et de déploiement sur AWS",
      image: "/placeholder.svg?height=300&width=300", //
      provider: "Amazon Web Services", //
      duration: "Validité de 3 ans", // remplacer par validity_period
      level: "Professionnel", //
      prerequisites: [
        "Expérience avec AWS",
        "Connaissances en automatisation et scripting",
        "Compréhension des méthodologies DevOps",
      ],
      benefits: [
        "Reconnaissance internationale",
        "Valorisation sur le marché du travail",
        "Accès à la communauté AWS Certified",
      ],
      link: "https://aws.amazon.com/certification/certified-devops-engineer-professional/", //
      formations: ["DevOps Professionnel"],
    },
    {
      id: 2,
      title: "Docker Certified Associate",
      description:
        "Démontrez votre expertise dans l'utilisation de Docker pour la conteneurisation d'applications",
      image: "/placeholder.svg?height=300&width=300",
      provider: "Docker, Inc.",
      duration: "Validité de 2 ans",
      level: "Associé",
      prerequisites: [
        "Expérience avec Docker",
        "Connaissances en ligne de commande Linux",
        "Compréhension des concepts de conteneurisation",
      ],
      benefits: [
        "Certification reconnue par l'industrie",
        "Validation des compétences Docker",
        "Différenciation sur le marché du travail",
      ], //
      link: "https://training.mirantis.com/certification/dca-certification-exam/",
      formations: ["DevOps Professionnel", "Docker & Kubernetes"],
    },
    {
      id: 3,
      title: "Certified Kubernetes Administrator (CKA)",
      description:
        "Certifiez vos compétences en administration de clusters Kubernetes",
      image: "/placeholder.svg?height=300&width=300",
      provider: "Cloud Native Computing Foundation",
      duration: "Validité de 3 ans",
      level: "Administrateur",
      prerequisites: [
        "Expérience avec Kubernetes",
        "Connaissances en administration système",
        "Familiarité avec les conteneurs",
      ],
      benefits: [
        "Certification de référence pour Kubernetes",
        "Reconnaissance internationale",
        "Valorisation des compétences cloud-native",
      ],
      link: "https://www.cncf.io/certification/cka/",
      formations: ["Docker & Kubernetes"],
    },
    {
      id: 4,
      title: "Jenkins Certified Engineer",
      description:
        "Validez vos compétences en matière d'intégration continue avec Jenkins",
      image: "/placeholder.svg?height=300&width=300",
      provider: "CloudBees",
      duration: "Validité de 2 ans",
      level: "Ingénieur",
      prerequisites: [
        "Expérience avec Jenkins",
        "Connaissances en CI/CD",
        "Compréhension des pipelines",
      ],
      benefits: [
        "Certification officielle Jenkins",
        "Validation des compétences en automatisation",
        "Reconnaissance par les employeurs",
      ],
      link: "https://www.cloudbees.com/jenkins/certification",
      formations: ["CI/CD Pipeline"],
    },
  ],
  testing: [
    {
      id: 5,
      title: "ISTQB Certified Tester - Foundation Level",
      description:
        "Acquérez les connaissances fondamentales en matière de tests logiciels",
      image: istqbLogo,
      provider: "International Software Testing Qualifications Board",
      duration: "Validité permanente",
      level: "Fondation",
      prerequisites: [
        "Aucun prérequis formel",
        "Intérêt pour les tests logiciels",
      ],
      benefits: [
        "Standard international en tests logiciels",
        "Base solide pour les spécialisations",
        "Reconnaissance dans plus de 100 pays",
      ],
      link: "https://www.istqb.org/certifications/certified-tester-foundation-level",
      formations: ["Test Automation Expert", "Tests Unitaires"],
    },
    {
      id: 6,
      title: "Selenium Certification",
      description:
        "Validez vos compétences en automatisation des tests avec Selenium",
      image: "/placeholder.svg?height=300&width=300",
      provider: "Selenium HQ",
      duration: "Validité de 2 ans",
      level: "Professionnel",
      prerequisites: [
        "Expérience en automatisation de tests",
        "Connaissances en programmation",
        "Familiarité avec Selenium WebDriver",
      ],
      benefits: [
        "Certification reconnue dans l'industrie",
        "Validation des compétences en automatisation",
        "Différenciation sur le marché du travail",
      ],
      link: "https://www.selenium.dev/certification/",
      formations: ["Test Automation Expert"],
    },
    {
      id: 7,
      title: "JMeter Certification",
      description:
        "Certifiez vos compétences en tests de performance avec Apache JMeter",
      image: "/placeholder.svg?height=300&width=300",
      provider: "Apache Software Foundation",
      duration: "Validité de 2 ans",
      level: "Professionnel",
      prerequisites: [
        "Expérience en tests de performance",
        "Connaissances en JMeter",
        "Compréhension des concepts de charge et stress",
      ],
      benefits: [
        "Validation des compétences en tests de performance",
        "Reconnaissance par les employeurs",
        "Différenciation professionnelle",
      ],
      link: "https://jmeter.apache.org/certification.html",
      formations: ["Performance Testing"],
    },
  ],
  web: [
    {
      id: 8,
      title: "JavaScript Certification",
      description:
        "Validez vos compétences en développement JavaScript moderne",
      image: "/placeholder.svg?height=300&width=300",
      provider: "OpenJS Foundation",
      duration: "Validité permanente",
      level: "Professionnel",
      prerequisites: [
        "Expérience en développement JavaScript",
        "Connaissances en ES6+",
        "Compréhension des concepts asynchrones",
      ],
      benefits: [
        "Certification reconnue dans l'industrie",
        "Validation des compétences JavaScript",
        "Différenciation sur le marché du travail",
      ],
      link: "https://openjsf.org/certification",
      formations: ["Développeur Full-Stack JavaScript"],
    },
    {
      id: 9,
      title: "React Developer Certification",
      description:
        "Certifiez vos compétences en développement d'applications avec React",
      image: "/placeholder.svg?height=300&width=300",
      provider: "Meta (Facebook)",
      duration: "Validité de 2 ans",
      level: "Développeur",
      prerequisites: [
        "Expérience en développement React",
        "Connaissances en JavaScript",
        "Compréhension des concepts de composants",
      ],
      benefits: [
        "Certification officielle React",
        "Validation des compétences frontend",
        "Reconnaissance par les employeurs",
      ],
      link: "https://reactjs.org/certification",
      formations: ["React & TypeScript"],
    },
    {
      id: 10,
      title: "Node.js Certification",
      description:
        "Validez vos compétences en développement backend avec Node.js",
      image: "/placeholder.svg?height=300&width=300",
      provider: "OpenJS Foundation",
      duration: "Validité de 2 ans",
      level: "Développeur",
      prerequisites: [
        "Expérience en développement Node.js",
        "Connaissances en JavaScript",
        "Compréhension des concepts asynchrones",
      ],
      benefits: [
        "Certification reconnue dans l'industrie",
        "Validation des compétences backend",
        "Différenciation sur le marché du travail",
      ],
      link: "https://openjsf.org/certification",
      formations: ["Développeur Full-Stack JavaScript"],
    },
  ],
  langc: [
    {
      id: 11,
      title: "C Programming Certification",
      description: "Certifiez vos compétences en programmation C",
      image: "/placeholder.svg?height=300&width=300",
      provider: "C Programming Institute",
      duration: "Validité permanente",
      level: "Fondation",
      prerequisites: [
        "Connaissances de base en programmation C",
        "Compréhension des concepts de programmation",
      ],
      benefits: [
        "Validation des compétences en langage C",
        "Reconnaissance par les employeurs",
        "Base solide pour les langages dérivés",
      ],
      link: "https://www.cprogramming.com/certification/",
      formations: ["C pour Débutants"],
    },
  ],
};

export default function CertificationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-muted py-12 md:py-16 lg:py-20">
          <div className="container">
            <motion.div
              className="mx-auto max-w-[800px] text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Nos Certifications
              </h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Découvrez les certifications reconnues internationalement que
                vous pouvez obtenir avec nos formations
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container py-12">
          <Tabs defaultValue="devops" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-4">
              <TabsTrigger value="devops">DevOps</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
              <TabsTrigger value="web">Développement Web</TabsTrigger>
              <TabsTrigger value="langc">Langage C</TabsTrigger>
            </TabsList>

            <TabsContent value="devops" className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certifications.devops.map((certification, index) => (
                  <motion.div
                    key={certification.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full flex flex-col">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-24 h-24 relative">
                          <img
                            src={certification.image || "/placeholder.svg"}
                            alt={certification.title}
                            className="object-contain"
                          />
                        </div>
                        <CardTitle>{certification.title}</CardTitle>
                        <CardDescription>
                          {certification.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium">Fournisseur:</p>
                            <p className="text-sm text-muted-foreground">
                              {certification.provider}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Niveau:</p>
                            <p className="text-sm text-muted-foreground">
                              {certification.level}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Validité:</p>
                            <p className="text-sm text-muted-foreground">
                              {certification.duration}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Prérequis:</p>
                            <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                              {certification.prerequisites.map(
                                (prerequisite, i) => (
                                  <li key={i} className="flex items-start">
                                    <CheckCircle className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{prerequisite}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Formations associées:
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                              {certification.formations.map((formation, i) => (
                                <li key={i} className="flex items-start">
                                  <Award className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                  <span>{formation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link
                            to={certification.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Site officiel
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="testing" className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certifications.testing.map((certification, index) => (
                  <motion.div
                    key={certification.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full flex flex-col">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-24 h-24 relative">
                          <img
                            src={certification.image || "/placeholder.svg"}
                            alt={certification.title}
                            className="object-contain"
                          />
                        </div>
                        <CardTitle>{certification.title}</CardTitle>
                        <CardDescription>
                          {certification.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium">Fournisseur:</p>
                            <p className="text-sm text-muted-foreground">
                              {certification.provider}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Niveau:</p>
                            <p className="text-sm text-muted-foreground">
                              {certification.level}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Validité:</p>
                            <p className="text-sm text-muted-foreground">
                              {certification.duration}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Prérequis:</p>
                            <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                              {certification.prerequisites.map(
                                (prerequisite, i) => (
                                  <li key={i} className="flex items-start">
                                    <CheckCircle className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{prerequisite}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Formations associées:
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                              {certification.formations.map((formation, i) => (
                                <li key={i} className="flex items-start">
                                  <Award className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                  <span>{formation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link
                            to={certification.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Site officiel
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="web" className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certifications.web.map((certification, index) => (
                  <motion.div
                    key={certification.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full flex flex-col">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-24 h-24 relative">
                          <img
                            src={certification.image || "/placeholder.svg"}
                            alt={certification.title}
                            className="object-contain"
                          />
                        </div>
                        <CardTitle>{certification.title}</CardTitle>
                        <CardDescription>
                          {certification.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium">Fournisseur:</p>
                            <p className="text-sm text-muted-foreground">
                              {certification.provider}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Niveau:</p>
                            <p className="text-sm text-muted-foreground">
                              {certification.level}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Validité:</p>
                            <p className="text-sm text-muted-foreground">
                              {certification.duration}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Prérequis:</p>
                            <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                              {certification.prerequisites.map(
                                (prerequisite, i) => (
                                  <li key={i} className="flex items-start">
                                    <CheckCircle className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{prerequisite}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Formations associées:
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                              {certification.formations.map((formation, i) => (
                                <li key={i} className="flex items-start">
                                  <Award className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                  <span>{formation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link
                            to={certification.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Site officiel
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="langc" className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certifications.langc.map((certification, index) => (
                  <motion.div
                    key={certification.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full flex flex-col">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-24 h-24 relative">
                          <img
                            src={certification.image || "/placeholder.svg"}
                            alt={certification.title}
                            className="object-contain"
                          />
                        </div>
                        <CardTitle>{certification.title}</CardTitle>
                        <CardDescription>
                          {certification.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium">Fournisseur:</p>
                            <p className="text-sm text-muted-foreground">
                              {certification.provider}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Niveau:</p>
                            <p className="text-sm text-muted-foreground">
                              {certification.level}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Validité:</p>
                            <p className="text-sm text-muted-foreground">
                              {certification.duration}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Prérequis:</p>
                            <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                              {certification.prerequisites.map(
                                (prerequisite, i) => (
                                  <li key={i} className="flex items-start">
                                    <CheckCircle className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{prerequisite}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Formations associées:
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                              {certification.formations.map((formation, i) => (
                                <li key={i} className="flex items-start">
                                  <Award className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                  <span>{formation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link
                            to={certification.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Site officiel
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="bg-muted py-12">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">
              Prêt à obtenir votre certification ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-[600px] mx-auto">
              Nos formations vous préparent aux examens de certification et vous
              donnent toutes les clés pour réussir.
            </p>
            <Button asChild size="lg">
              <Link to="/formations">Découvrir nos formations</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
