import { useState } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router"; // Ajout de useLocation
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import zettaLogo from "~/assets/zetta-logo.png";

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Pour détecter la route active

  const navItems = [
    { to: "/", label: "Accueil" },
    { to: "/formations", label: "Formations" },
    { to: "/certifications", label: "Certifications" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "À propos" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div className="flex w-full items-center justify-between m-2">
      <Link to="/" className="flex items-center space-x-2">
        <img src={zettaLogo} className="h-10" alt="zetta logo" />
      </Link>

      <nav className="hidden md:flex md:items-center md:space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`text-sm font-medium transition-colors hover:text-orange-600 ${
              location.pathname === item.to
                ? "text-orange-600"
                : "text-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
        {/* <Button asChild className="bg-orange-600 hover:bg-orange-700">
          <Link to="/contact#interest-form">Exprimer mon intérêt</Link>
        </Button> */}
      </nav>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-lg font-medium transition-colors hover:text-orange-600 ${
                  location.pathname === item.to
                    ? "text-orange-600"
                    : "text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* <Button asChild className="mt-4 bg-orange-600 hover:bg-orange-700">
              <Link
                to="/contact#interest-form"
                onClick={() => setIsOpen(false)}
              >
                Exprimer mon intérêt
              </Link>
            </Button> */}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
