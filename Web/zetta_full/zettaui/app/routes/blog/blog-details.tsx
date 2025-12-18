"use client";

import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import { Footer } from "~/components/footer";
import { MainNav } from "~/components/main-nav";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

// Données fictives pour les articles de blog
const blogPostsData = {
  "tendances-devops-2024": {
    id: 1,
    title: "Les tendances DevOps à surveiller en 2024",
    excerpt:
      "Découvrez les principales tendances DevOps qui façonneront l'industrie technologique cette année.",
    content: `
      <h2>Introduction</h2>
      <p>Le DevOps continue d'évoluer rapidement, avec de nouvelles pratiques et technologies qui émergent chaque année. En 2024, plusieurs tendances majeures se dessinent, qui vont transformer la façon dont les équipes développent, déploient et maintiennent leurs applications.</p>
      
      <h2>1. GitOps et Infrastructure as Code (IaC)</h2>
      <p>Le GitOps, qui consiste à utiliser Git comme source unique de vérité pour la configuration des infrastructures, gagne en popularité. Cette approche permet une meilleure traçabilité, une collaboration plus efficace et une automatisation plus poussée. Parallèlement, l'Infrastructure as Code (IaC) continue de s'imposer comme une pratique essentielle, avec des outils comme Terraform, Pulumi et AWS CDK qui offrent des fonctionnalités toujours plus avancées.</p>
      
      <h2>2. DevSecOps et sécurité intégrée</h2>
      <p>La sécurité n'est plus une considération après-coup, mais devient une partie intégrante du cycle de développement. Les pratiques DevSecOps, qui consistent à intégrer la sécurité dès les premières étapes du développement, sont désormais essentielles. Les outils d'analyse statique du code, de scan de vulnérabilités et de tests de pénétration automatisés sont de plus en plus intégrés dans les pipelines CI/CD.</p>
      
      <h2>3. Kubernetes et l'écosystème cloud-native</h2>
      <p>Kubernetes s'est imposé comme la plateforme standard pour l'orchestration de conteneurs, et son écosystème continue de s'enrichir. Des outils comme Istio pour le service mesh, Knative pour le serverless, et Argo CD pour le GitOps, étendent les capacités de Kubernetes et facilitent la gestion d'applications complexes. La CNCF (Cloud Native Computing Foundation) continue d'incuber de nouveaux projets qui enrichissent cet écosystème.</p>
      
      <h2>4. Observabilité et AIOps</h2>
      <p>L'observabilité, qui va au-delà de la simple surveillance pour permettre de comprendre l'état interne d'un système à partir de ses sorties, devient cruciale dans des environnements distribués complexes. Les plateformes d'observabilité comme Grafana, Datadog et New Relic intègrent de plus en plus de fonctionnalités d'intelligence artificielle (AIOps) pour aider à détecter les anomalies, prédire les problèmes et automatiser la résolution des incidents.</p>
      
      <h2>5. Plateformes d'expérience développeur (DXP)</h2>
      <p>Les entreprises investissent dans des plateformes internes qui améliorent l'expérience des développeurs en automatisant les tâches répétitives, en standardisant les environnements de développement et en fournissant des outils self-service. Ces plateformes, souvent appelées "Internal Developer Platforms" (IDP) ou "Developer Experience Platforms" (DXP), permettent aux développeurs de se concentrer sur la création de valeur plutôt que sur la gestion de l'infrastructure.</p>
      
      <h2>Conclusion</h2>
      <p>Le DevOps continue d'évoluer vers une automatisation toujours plus poussée, une sécurité intégrée et une meilleure expérience développeur. Les organisations qui adoptent ces tendances seront mieux positionnées pour innover rapidement tout en maintenant la stabilité et la sécurité de leurs systèmes. En 2024, l'accent sera mis sur la simplification des workflows, l'amélioration de la collaboration et l'utilisation de l'intelligence artificielle pour optimiser les processus DevOps.</p>
    `,
    image: "/placeholder.svg?height=600&width=1200",
    date: "15 janvier 2024",
    author: "Thomas Dubois",
    authorRole: "Expert DevOps & Cloud",
    authorImage: "/placeholder.svg?height=100&width=100",
    readTime: "5 min",
    category: "DevOps",
    tags: ["DevOps", "GitOps", "Kubernetes", "DevSecOps", "AIOps"],
  },
  "ameliorer-qualite-tests-automatises": {
    id: 2,
    title: "Comment améliorer la qualité de vos tests automatisés",
    excerpt:
      "Apprenez les meilleures pratiques pour rendre vos tests automatisés plus fiables et maintenables.",
    content: `
      <h2>Introduction</h2>
      <p>Les tests automatisés sont essentiels pour garantir la qualité des logiciels et permettre des déploiements fréquents et fiables. Cependant, des tests mal conçus peuvent devenir un fardeau plutôt qu'un atout. Dans cet article, nous explorerons les meilleures pratiques pour améliorer la qualité de vos tests automatisés.</p>
      
      <h2>1. Suivre la pyramide de tests</h2>
      <p>La pyramide de tests, popularisée par Mike Cohn, suggère une répartition des tests en trois niveaux : tests unitaires (base), tests d'intégration (milieu) et tests d'interface utilisateur (sommet). Cette approche permet d'avoir une couverture de tests efficace tout en minimisant le temps d'exécution et la fragilité des tests. Assurez-vous d'avoir une base solide de tests unitaires rapides, complétée par des tests d'intégration et un nombre limité de tests d'interface utilisateur.</p>
      
      <h2>2. Appliquer les principes FIRST</h2>
      <p>Les tests de qualité suivent les principes FIRST :</p>
      <ul>
        <li><strong>Fast</strong> : Les tests doivent s'exécuter rapidement pour fournir un feedback immédiat.</li>
        <li><strong>Isolated/Independent</strong> : Chaque test doit être indépendant des autres et pouvoir s'exécuter seul.</li>
        <li><strong>Repeatable</strong> : Les tests doivent donner les mêmes résultats à chaque exécution.</li>
        <li><strong>Self-validating</strong> : Les tests doivent déterminer eux-mêmes s'ils réussissent ou échouent.</li>
        <li><strong>Timely</strong> : Les tests doivent être écrits au bon moment, idéalement avant ou en même temps que le code de production.</li>
      </ul>
      
      <h2>3. Utiliser des patterns de conception pour les tests</h2>
      <p>Des patterns comme Page Object Model pour les tests d'interface utilisateur, ou le pattern AAA (Arrange-Act-Assert) pour structurer vos tests, améliorent la lisibilité et la maintenabilité. Ces patterns permettent de séparer les préoccupations et de réduire la duplication de code dans vos tests.</p>
      
      <h2>4. Gérer efficacement les données de test</h2>
      <p>La gestion des données de test est souvent un défi. Utilisez des approches comme les fixtures, les factories ou les builders pour créer des données de test de manière flexible et maintenable. Évitez de dépendre de données externes qui pourraient changer et rendre vos tests instables.</p>
      
      <h2>5. Traiter les tests flaky</h2>
      <p>Les tests "flaky" (instables) qui échouent de manière intermittente sont particulièrement problématiques. Identifiez et corrigez les causes courantes comme les conditions de course, les dépendances externes, les timeouts inadéquats ou les sélecteurs d'interface utilisateur fragiles. Mettez en place un système pour marquer, isoler et corriger systématiquement ces tests.</p>
      
      <h2>6. Implémenter une stratégie de CI/CD robuste</h2>
      <p>Intégrez vos tests dans un pipeline CI/CD bien conçu qui exécute les tests appropriés au bon moment. Par exemple, exécutez les tests unitaires à chaque commit, les tests d'intégration à chaque pull request, et les tests end-to-end avant le déploiement en production. Utilisez la parallélisation et d'autres techniques pour réduire le temps d'exécution des tests.</p>
      
      <h2>Conclusion</h2>
      <p>L'amélioration de la qualité des tests automatisés est un processus continu qui nécessite attention et discipline. En suivant ces meilleures pratiques, vous pouvez créer une suite de tests qui non seulement détecte efficacement les régressions, mais qui est également maintenable et évolutive. Des tests de qualité permettent aux équipes de développement de livrer des fonctionnalités plus rapidement et avec confiance, tout en maintenant un haut niveau de qualité logicielle.</p>
    `,
    image: "/placeholder.svg?height=600&width=1200",
    date: "28 décembre 2023",
    author: "Sophie Martin",
    authorRole: "Experte en Automatisation de Tests",
    authorImage: "/placeholder.svg?height=100&width=100",
    readTime: "8 min",
    category: "Testing",
    tags: ["Testing", "Automatisation", "Qualité logicielle", "CI/CD"],
  },
  "react-vs-angular-2024": {
    id: 3,
    title: "React vs Angular : quel framework choisir en 2024 ?",
    excerpt:
      "Analyse comparative des deux frameworks JavaScript les plus populaires pour le développement frontend.",
    content: `
      <h2>Introduction</h2>
      <p>Le choix d'un framework frontend est une décision cruciale qui peut avoir un impact significatif sur le développement et la maintenance d'une application web. React et Angular restent deux des options les plus populaires en 2024, chacune avec ses forces et ses faiblesses. Dans cet article, nous comparerons ces deux frameworks pour vous aider à faire un choix éclairé.</p>
      
      <h2>Philosophie et architecture</h2>
      <p><strong>React</strong>, développé par Facebook, est une bibliothèque JavaScript pour construire des interfaces utilisateur. Il se concentre sur la création de composants réutilisables et adopte une approche déclarative. React ne dicte pas l'architecture globale de votre application, vous laissant libre de choisir les bibliothèques complémentaires pour le routing, la gestion d'état, etc.</p>
      
      <p><strong>Angular</strong>, maintenu par Google, est un framework complet qui fournit une solution tout-en-un pour le développement frontend. Il utilise TypeScript par défaut et suit une architecture basée sur les composants, les services et les modules. Angular inclut tout ce dont vous avez besoin pour développer une application complète : routing, formulaires, HTTP, tests, etc.</p>
      
      <h2>Courbe d'apprentissage</h2>
      <p><strong>React</strong> est généralement considéré comme plus facile à apprendre, surtout pour les développeurs qui connaissent déjà JavaScript. Sa documentation est excellente et son API relativement simple. Cependant, l'écosystème React (Redux, React Router, etc.) peut être intimidant pour les débutants, car il n'y a pas de "façon officielle" de faire les choses.

<p><strong>Angular</strong> a une courbe d'apprentissage plus raide. Il nécessite de comprendre TypeScript, les décorateurs, l'injection de dépendances et d'autres concepts avancés. Cependant, une fois ces concepts maîtrisés, le développement devient plus structuré et prévisible.</p>

<h2>Performance</h2>
<p><strong>React</strong> utilise un DOM virtuel pour optimiser les mises à jour du DOM réel, ce qui lui confère d'excellentes performances. Avec l'introduction de React Fiber et des hooks, React a encore amélioré ses performances et sa flexibilité.</p>

<p><strong>Angular</strong> utilise le change detection pour détecter les modifications dans l'application. Bien qu'il ait été critiqué pour ses performances dans les versions précédentes, Angular a fait d'énormes progrès avec l'introduction d'Ivy, son nouveau moteur de rendu et compilateur.</p>

<h2>Écosystème et communauté</h2>
<p><strong>React</strong> bénéficie d'un écosystème vaste et dynamique, avec de nombreuses bibliothèques tierces. Sa communauté est très active, produisant constamment de nouveaux outils et ressources. React Native permet également de réutiliser les compétences React pour le développement mobile.</p>

<p><strong>Angular</strong> offre un écosystème plus structuré mais moins étendu. Il est soutenu par Google, ce qui garantit une certaine stabilité et des mises à jour régulières. Angular Universal permet le rendu côté serveur, et NativeScript ou Ionic peuvent être utilisés pour le développement mobile.</p>

<h2>Cas d'utilisation</h2>
<p><strong>React</strong> est particulièrement adapté pour :</p>
<ul>
  <li>Les startups qui ont besoin de développer rapidement et d'itérer</li>
  <li>Les applications qui nécessitent une grande flexibilité</li>
  <li>Les équipes qui préfèrent choisir leurs propres bibliothèques</li>
  <li>Les projets qui pourraient s'étendre au mobile avec React Native</li>
</ul>

<p><strong>Angular</strong> est plus adapté pour :</p>
<ul>
  <li>Les grandes entreprises avec des équipes importantes</li>
  <li>Les applications d'entreprise complexes</li>
  <li>Les équipes qui préfèrent une solution tout-en-un</li>
  <li>Les projets qui bénéficient d'une structure stricte et de conventions claires</li>
</ul>

<h2>Conclusion</h2>
<p>En 2024, le choix entre React et Angular dépend largement de vos besoins spécifiques, de la taille de votre équipe et de vos préférences en matière de développement. React offre plus de flexibilité et une courbe d'apprentissage plus douce, tandis qu'Angular fournit une solution plus complète et structurée. Les deux frameworks sont matures, bien soutenus et capables de produire des applications web modernes et performantes.</p>

<p>Quelle que soit votre décision, l'important est de choisir l'outil qui correspond le mieux à votre projet et à votre équipe, et de rester à jour avec les évolutions constantes de ces technologies.</p>
    `,
    image: "/placeholder.svg?height=600&width=1200",
    date: "10 décembre 2023",
    author: "Julie Leroy",
    authorRole: "Lead Developer Full-Stack",
    authorImage: "/placeholder.svg?height=100&width=100",
    readTime: "10 min",
    category: "Web",
    tags: ["React", "Angular", "JavaScript", "Frontend"],
  },
};

export default function BlogPostPage() {
  const { slug } = useParams();

  // Vérifier si le slug est une chaîne de caractères
  const postSlug = Array.isArray(slug) ? slug[0] : slug;

  // Récupérer les données de l'article
  const post = blogPostsData[postSlug as keyof typeof blogPostsData];

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 container py-12">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Article non trouvé</h1>
            <p className="text-muted-foreground mb-8">
              L'article que vous recherchez n'existe pas ou a été déplacé.
            </p>
            <Button asChild>
              <Link to="/blog">Voir tous les articles</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div
          className="relative h-[300px] md:h-[400px] w-full"
          style={{
            backgroundImage: `url(${post.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="container relative z-10 flex h-full flex-col justify-center text-white">
            <Badge className="mb-4 w-fit">{post.category}</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                <span>{post.readTime} de lecture</span>
              </div>
            </div>
          </div>
        </div>

        <section className="container py-12">
          <div className="mx-auto max-w-[800px]">
            <Button asChild variant="ghost" className="mb-8">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux articles
              </Link>
            </Button>

            <div className="flex items-center mb-8">
              <img
                src={post.authorImage || "/placeholder.svg"}
                alt={post.author}
                width={60}
                height={60}
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="font-medium">{post.author}</h3>
                <p className="text-sm text-muted-foreground">
                  {post.authorRole}
                </p>
              </div>
            </div>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-bold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
