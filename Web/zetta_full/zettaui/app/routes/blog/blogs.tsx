"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, User, Clock, ArrowRight } from "lucide-react";
import { MainNav } from "~/components/main-nav";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Link } from "react-router";
import { Footer } from "~/components/footer";

const blogPosts = [
  {
    id: 1,
    title: "Les tendances DevOps à surveiller en 2024",
    excerpt:
      "Découvrez les principales tendances DevOps qui façonneront l'industrie technologique cette année.",
    image: "/placeholder.svg?height=400&width=600",
    date: "15 janvier 2024",
    author: "Thomas Dubois",
    readTime: "5 min",
    category: "DevOps",
    slug: "tendances-devops-2024",
  },
  {
    id: 2,
    title: "Comment améliorer la qualité de vos tests automatisés",
    excerpt:
      "Apprenez les meilleures pratiques pour rendre vos tests automatisés plus fiables et maintenables.",
    image: "/placeholder.svg?height=400&width=600",
    date: "28 décembre 2023",
    author: "Sophie Martin",
    readTime: "8 min",
    category: "Testing",
    slug: "ameliorer-qualite-tests-automatises",
  },
  {
    id: 3,
    title: "React vs Angular : quel framework choisir en 2024 ?",
    excerpt:
      "Analyse comparative des deux frameworks JavaScript les plus populaires pour le développement frontend.",
    image: "/placeholder.svg?height=400&width=600",
    date: "10 décembre 2023",
    author: "Julie Leroy",
    readTime: "10 min",
    category: "Web",
    slug: "react-vs-angular-2024",
  },
  {
    id: 4,
    title: "Introduction à Kubernetes pour les débutants",
    excerpt:
      "Un guide pas à pas pour comprendre et commencer à utiliser Kubernetes dans vos projets.",
    image: "/placeholder.svg?height=400&width=600",
    date: "5 décembre 2023",
    author: "Marc Dupont",
    readTime: "12 min",
    category: "DevOps",
    slug: "introduction-kubernetes-debutants",
  },
  {
    id: 5,
    title: "Les bases du langage C pour la programmation système",
    excerpt:
      "Découvrez pourquoi le langage C reste incontournable pour le développement système et embarqué.",
    image: "/placeholder.svg?height=400&width=600",
    date: "20 novembre 2023",
    author: "Alexandre Petit",
    readTime: "7 min",
    category: "Langage C",
    slug: "bases-langage-c-programmation-systeme",
  },
  {
    id: 6,
    title: "Comment préparer la certification AWS DevOps Engineer",
    excerpt:
      "Conseils et ressources pour réussir l'examen de certification AWS DevOps Engineer Professional.",
    image: "/placeholder.svg?height=400&width=600",
    date: "15 novembre 2023",
    author: "Thomas Dubois",
    readTime: "9 min",
    category: "DevOps",
    slug: "preparer-certification-aws-devops-engineer",
  },
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      post.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...new Set(blogPosts.map((post) => post.category.toLowerCase())),
  ];

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
                Blog & Actualités
              </h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Découvrez nos derniers articles, tutoriels et conseils sur les
                technologies et certifications
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container py-12">
          <div className="mb-8 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un article..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      categoryFilter === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category === "all" ? "Tous" : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="my-20 text-center">
              <h3 className="text-xl font-medium">
                Aucun article ne correspond à votre recherche
              </h3>
              <p className="mt-2 text-muted-foreground">
                Essayez de modifier vos critères de recherche
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={600}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge>{post.category}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          {post.readTime}
                        </div>
                      </div>
                      <CardTitle className="mt-2">{post.title}</CardTitle>
                      <CardDescription>{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-1 h-4 w-4" />
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="ghost" className="w-full">
                        <Link to={`/blog/${post.slug}`}>
                          Lire l'article <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-muted py-12 md:py-16">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4">
              Abonnez-vous à notre newsletter
            </h2>
            <p className="text-muted-foreground mb-8 max-w-[600px] mx-auto">
              Recevez nos derniers articles, tutoriels et actualités directement
              dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-[500px] mx-auto">
              <Input placeholder="Votre adresse email" className="flex-1" />
              <Button>S'abonner</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
