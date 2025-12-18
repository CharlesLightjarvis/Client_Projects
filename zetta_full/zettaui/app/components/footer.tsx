import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { Link } from "react-router";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import zetta from "../assets/zetta-logo.png";

export function Footer() {
  return (
    <footer className="bg-muted">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={zetta} alt="zetta logo" className="h-[40px] mb-2" />
            <p className="text-muted-foreground">
              Centre de formation spécialisé dans les certifications
              technologiques pour les professionnels de l'IT.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/formations"
                  className="text-muted-foreground hover:text-primary"
                >
                  Formations
                </Link>
              </li>
              <li>
                <Link
                  to="/certifications"
                  className="text-muted-foreground hover:text-primary"
                >
                  Certifications
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/a-propos"
                  className="text-muted-foreground hover:text-primary"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  Route Lafrane km 1, Sfax
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="mr-2 h-5 w-5 text-primary" />
                <span className="text-muted-foreground">+216 22 008 997</span>
              </li>
              <li className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  contact@zetta-training.tn
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Newsletter</h3>
            <p className="text-muted-foreground">
              Inscrivez-vous à notre newsletter pour recevoir nos actualités et
              offres spéciales.
            </p>
            <form className="mt-4 space-y-2">
              <Input type="email" placeholder="Votre email" />
              <Button type="submit" className="w-full">
                S'inscrire
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Zetta. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <Link to="/mentions-legales" className="hover:text-primary">
              Mentions légales
            </Link>
            <Link
              to="/politique-confidentialite"
              className="hover:text-primary"
            >
              Politique de confidentialité
            </Link>
            <Link to="/cgv" className="hover:text-primary">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
