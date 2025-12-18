"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { MainNav } from "~/components/main-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Footer } from "~/components/footer";
import localisation from "~/assets/localisation.png";
import useCategoryStore from "~/store/use-category-store";
import { LoadingScreen } from "~/components/loading-screen";
import defaultLearningImage from "~/assets/Learning-bro.png";
import UpperNav from "~/components/upper-nav";

export default function ContactPage() {
  const [interestFormData, setInterestFormData] = useState({
    name: "",
    email: "",
    phone: "",
    formation: "",
    message: "",
  });

  const { categories, fetchCategories, loading, error } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [interestFormSubmitted, setInterestFormSubmitted] = useState(false);
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);

  const handleInterestFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setInterestFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setContactFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pourriez envoyer les données à votre backend
    console.log("Interest form data:", interestFormData);
    setInterestFormSubmitted(true);
    // Réinitialiser le formulaire après soumission
    setInterestFormData({
      name: "",
      email: "",
      phone: "",
      formation: "",
      message: "",
    });
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pourriez envoyer les données à votre backend
    console.log("Contact form data:", contactFormData);
    setContactFormSubmitted(true);
    // Réinitialiser le formulaire après soumission
    setContactFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  if (loading) return <LoadingScreen />;

  if (error) return <div>Erreur : {error}</div>;

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
                Contactez-nous
              </h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Nous sommes à votre disposition pour répondre à toutes vos
                questions concernant nos formations et certifications
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Nos coordonnées</CardTitle>
                  <CardDescription>
                    Plusieurs façons de nous contacter
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="mr-3 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Adresse</h3>
                      <p className="text-muted-foreground">
                        Route Lafrane km 1, Sfax
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="mr-3 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Téléphone</h3>
                      <p className="text-muted-foreground">+216 20 20 20 20</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="mr-3 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">
                        contact@zetta-training.tn
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="h-[400px] w-full overflow-hidden rounded-md bg-muted">
                    {/* Ici, vous pourriez intégrer une carte Google Maps */}
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d419622.171217443!2d10.747764!3d34.74808!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzTCsDQ0JzUzLjEiTiAxMMKwNDQnNTIuMCJF!5e0!3m2!1sfr!2sus!4v1743449748072!5m2!1sfr!2sus"
                      width="600"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Formulaire de contact</CardTitle>
                  <CardDescription>Envoyez-nous un message</CardDescription>
                </CardHeader>
                <CardContent>
                  {contactFormSubmitted ? (
                    <div className="rounded-md bg-green-50 p-4 text-green-800">
                      <h3 className="text-lg font-medium">Message envoyé !</h3>
                      <p>Nous vous répondrons dans les plus brefs délais.</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setContactFormSubmitted(false)}
                      >
                        Envoyer un autre message
                      </Button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleContactFormSubmit}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Nom et prénom</Label>
                        <Input
                          id="contact-name"
                          name="name"
                          value={contactFormData.name}
                          onChange={handleContactFormChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          value={contactFormData.email}
                          onChange={handleContactFormChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">Phone</Label>
                        <Input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          value={contactFormData.phone}
                          onChange={handleContactFormChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-subject">Sujet</Label>
                        <Select
                          name="subject"
                          value={contactFormData.subject}
                          onValueChange={(value: any) =>
                            setContactFormData((prev) => ({
                              ...prev,
                              subject: value,
                            }))
                          }
                          required
                        >
                          <SelectTrigger
                            id="contact-subject"
                            className="w-full"
                          >
                            <SelectValue placeholder="Sélectionnez un sujet" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="information">
                              Demande d'information
                            </SelectItem>
                            <SelectItem value="devis">
                              Demande de devis
                            </SelectItem>
                            <SelectItem value="partenariat">
                              Proposition de partenariat
                            </SelectItem>
                            <SelectItem value="reclamation">
                              Réclamation
                            </SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-message">Message</Label>
                        <Textarea
                          id="contact-message"
                          placeholder="Écrivez votre message..."
                          name="message"
                          rows={5}
                          value={contactFormData.message}
                          onChange={handleContactFormChange}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer le message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section id="interest-form" className="bg-muted py-12 md:py-16">
          <div className="container">
            <motion.div
              className="mx-auto max-w-[800px] text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight">
                Exprimez votre intérêt
              </h2>
              <p className="mt-4 text-muted-foreground">
                Vous êtes intéressé par l'une de nos formations ? Remplissez ce
                formulaire et nous vous contacterons rapidement.
              </p>
            </motion.div>

            <div className="mx-auto mt-8 max-w-[600px]">
              <Card>
                <CardHeader>
                  <CardTitle>Formulaire d'expression d'intérêt</CardTitle>
                  <CardDescription>
                    Tous les champs marqués d'un * sont obligatoires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {interestFormSubmitted ? (
                    <div className="rounded-md bg-green-50 p-4 text-green-800">
                      <h3 className="text-lg font-medium">Demande envoyée !</h3>
                      <p>
                        Merci pour votre intérêt. Un conseiller vous contactera
                        dans les plus brefs délais.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setInterestFormSubmitted(false)}
                      >
                        Soumettre une nouvelle demande
                      </Button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleInterestFormSubmit}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="interest-name">Nom et prénom *</Label>
                        <Input
                          id="interest-name"
                          name="name"
                          value={interestFormData.name}
                          onChange={handleInterestFormChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interest-email">Email *</Label>
                        <Input
                          id="interest-email"
                          name="email"
                          type="email"
                          value={interestFormData.email}
                          onChange={handleInterestFormChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interest-phone">Téléphone *</Label>
                        <Input
                          id="interest-phone"
                          name="phone"
                          type="tel"
                          value={interestFormData.phone}
                          onChange={handleInterestFormChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interest-formation">
                          Formation souhaitée *
                        </Label>
                        <Select
                          name="formation"
                          value={interestFormData.formation}
                          onValueChange={(value: any) =>
                            setInterestFormData((prev) => ({
                              ...prev,
                              formation: value,
                            }))
                          }
                          required
                        >
                          <SelectTrigger
                            id="interest-formation"
                            className="w-full"
                          >
                            <SelectValue placeholder="Sélectionnez une formation" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.name}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interest-message">
                          Message (optionnel)
                        </Label>
                        <Textarea
                          id="interest-message"
                          name="message"
                          rows={5}
                          value={interestFormData.message}
                          onChange={handleInterestFormChange}
                          placeholder="Précisez vos attentes, questions ou besoins spécifiques..."
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Soumettre ma demande
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
