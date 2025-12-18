"use client";

import { motion } from "framer-motion";
import { CheckCircle, Award, Users, Building, MapPin } from "lucide-react";
import { Footer } from "~/components/footer";
import { MainNav } from "~/components/main-nav";
import team from "~/assets/team.png";
import user from "~/assets/user.png";
import locaux from "~/assets/locaux.png";
import UpperNav from "~/components/upper-nav";
import defaultLearningImage from "~/assets/Learning-bro.png";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <UpperNav />
        <div className="container border-b">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-muted">
          {/* Image de fond bien visible mais discrète */}
          <div className="absolute inset-0 z-0">
            <img
              src={defaultLearningImage} // Remplacez par votre image
              alt="Arrière-plan formations"
              className="w-full h-full object-cover object-center opacity-30" // Opacité à 30% pour une bonne visibilité
            />
            <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-muted/70"></div>{" "}
            {/* Dégradé pour améliorer la lisibilité */}
          </div>

          {/* Contenu */}
          <div className="container relative z-10">
            <motion.div
              className="mx-auto max-w-[800px] text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
                À propos de Zetta
              </h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Centre d'excellence en formation technologique depuis 2023
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Notre mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Chez Zetta, notre mission est de former les professionnels de
                l'informatique aux technologies les plus demandées sur le
                marché, en leur offrant des formations de qualité et des
                certifications reconnues internationalement.
              </p>
              <p className="text-lg text-muted-foreground">
                Nous croyons que la formation continue est essentielle dans un
                domaine en constante évolution comme l'informatique. C'est
                pourquoi nous mettons à jour régulièrement nos programmes pour
                intégrer les dernières avancées technologiques et les meilleures
                pratiques de l'industrie.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-lg overflow-hidden"
            >
              <img
                src={team}
                alt="Notre équipe en formation"
                className="object-cover"
              />
            </motion.div>
          </div>
        </section>

        <section className="bg-muted py-12 md:py-16">
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Nos valeurs</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Les valeurs qui guident nos actions et nos décisions au
                quotidien
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-lg"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-muted-foreground">
                  Nous visons l'excellence dans tous les aspects de notre
                  travail, de la qualité de nos formations à l'accompagnement de
                  nos étudiants.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-lg"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  Nous restons à la pointe de l'innovation technologique pour
                  offrir des formations pertinentes et actuelles.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-lg"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Accompagnement</h3>
                <p className="text-muted-foreground">
                  Nous accompagnons chaque étudiant dans son parcours
                  d'apprentissage et son développement professionnel.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Notre équipe</h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              Des formateurs experts dans leur domaine, passionnés par la
              transmission de connaissances
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative h-[200px] w-[200px] mx-auto mb-4 rounded-full overflow-hidden">
                <img src={user} alt="Thomas Dubois" className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Thomas Dubois</h3>
              <p className="text-primary font-medium">Expert DevOps & Cloud</p>
              <p className="text-muted-foreground mt-2">
                10+ ans d'expérience dans l'industrie, certifié AWS et Docker
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative h-[200px] w-[200px] mx-auto mb-4 rounded-full overflow-hidden">
                <img src={user} alt="Sophie Martin" className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Sophie Martin</h3>
              <p className="text-primary font-medium">
                Experte en Automatisation de Tests
              </p>
              <p className="text-muted-foreground mt-2">
                8 ans d'expérience en QA, certifiée ISTQB et Selenium
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative h-[200px] w-[200px] mx-auto mb-4 rounded-full overflow-hidden">
                <img src={user} alt="Julie Leroy" className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Julie Leroy</h3>
              <p className="text-primary font-medium">
                Lead Developer Full-Stack
              </p>
              <p className="text-muted-foreground mt-2">
                7 ans d'expérience en développement web, spécialiste JavaScript
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative h-[200px] w-[200px] mx-auto mb-4 rounded-full overflow-hidden">
                <img
                  src={user}
                  alt="Alexandre Petit"
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Alexandre Petit</h3>
              <p className="text-primary font-medium">
                Expert en Programmation Système
              </p>
              <p className="text-muted-foreground mt-2">
                12 ans d'expérience en développement système et embarqué
              </p>
            </motion.div>
          </div>
        </section>

        <section className="bg-muted py-12 md:py-16">
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Nos chiffres clés</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                TechCert en quelques chiffres
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-lg text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">14</div>
                <p className="text-muted-foreground">Années d'expérience</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-lg text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">
                  5000+
                </div>
                <p className="text-muted-foreground">Étudiants formés</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-lg text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">20</div>
                <p className="text-muted-foreground">Formateurs experts</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-lg text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <p className="text-muted-foreground">Taux de satisfaction</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-lg overflow-hidden"
            >
              <img src={locaux} alt="Nos locaux" className="object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Nos locaux</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Situés à Route Lafrane Km 1, nos locaux modernes offrent un
                environnement d'apprentissage optimal avec des salles de
                formation équipées des dernières technologies.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Building className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Équipements modernes</h3>
                    <p className="text-muted-foreground">
                      Salles équipées d'ordinateurs performants et de matériel
                      pédagogique de pointe
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Localisation centrale</h3>
                    <p className="text-muted-foreground">
                      Facilement accessible en transports en commun, à proximité
                      des gares et des principales lignes de métro
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Espaces de collaboration</h3>
                    <p className="text-muted-foreground">
                      Zones de détente et de travail collaboratif pour favoriser
                      les échanges entre participants
                    </p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
