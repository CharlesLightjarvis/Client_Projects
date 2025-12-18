import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

export default function UpperNav() {
  return (
    <div className="w-full bg-white border-b border-gray-300">
      <div className="container flex flex-col md:flex-row justify-between items-center py-2 text-sm text-gray-800">
        {/* Informations de contact */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-accent-foreground mb-2 md:mb-0">
          <span className="flex items-center space-x-1">
            <Mail size={16} className="text-orange-600" />
            <a
              href="mailto:contact@zetta-training.tn"
              className="text-xs sm:text-sm"
            >
              contact@zetta-training.tn
            </a>
          </span>
          <span className="flex items-center space-x-1">
            <Phone size={16} className="text-orange-600" />
            <a href="tel:+21622008997" className="text-xs sm:text-sm">
              +216 22 008 997
            </a>
          </span>
          <span className="flex items-center space-x-1">
            <MapPin size={16} className="text-orange-600" />
            <span className="text-xs sm:text-sm">Route Lafrane km 1, Sfax</span>
          </span>
        </div>

        {/* Réseaux sociaux */}
        <div className="flex space-x-4 text-black">
          <a href="#" className="hover:text-orange-600 transition-colors">
            <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />
          </a>
          <a href="#" className="hover:text-orange-600 transition-colors">
            <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
          </a>
          <a href="#" className="hover:text-orange-600 transition-colors">
            <Linkedin size={16} className="sm:w-[18px] sm:h-[18px]" />
          </a>
          <a href="#" className="hover:text-orange-600 transition-colors">
            <Youtube size={16} className="sm:w-[18px] sm:h-[18px]" />
          </a>
        </div>
      </div>
    </div>
  );
}
