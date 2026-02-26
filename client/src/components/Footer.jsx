import React from "react";
import { Link } from "../hooks/useRouter.jsx";
import {
  Instagram,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Sparkles,
  Globe,
  LinkIcon,
} from "lucide-react";

/**
 * Footer Component
 * Site-wide footer matching Comet design
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Get In Touch */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Get In Touch
              </h3>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-neutral-400">Whatsapp: </span>
                  <a href="tel:+919606081463" className="text-white underline hover:text-neutral-300">
                    +91 97*******3
                  </a>
                </div>
              </div>
              <div>
                <span className="text-neutral-400">Support: </span>
                <a href="mailto:hello@sprintwear.com" className="text-white underline hover:text-neutral-300">
                  hello@sprintwear.com
                </a>
              </div>
              <div>
                <span className="text-neutral-400">Gifting and Corporate Orders: </span>
                <a href="mailto:bulkorders@sprintwear.com" className="text-white underline hover:text-neutral-300">
                  bulkorders@sprintwear.com
                </a>
              </div>
              <div>
                <span className="text-neutral-400">Marketing & Partnership: </span>
                <a href="mailto:partnerships@sprintwear.com" className="text-white underline hover:text-neutral-300">
                  partnerships@sprintwear.com
                </a>
              </div>
              <div>
                <span className="text-neutral-400">Careers: </span>
                <a href="/careers" className="text-white underline hover:text-neutral-300">
                  Apply Here
                </a>
              </div>
            </div>

            {/* Reach Us */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Reach Us
                </h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">
                nrd Floor, No.616, some road, 4th Block,<br />
                some area, somecity, some state, 56***4
              </p>
            </div>
          </div>

          {/* Social & About Us */}
          <div>
            {/* Social */}
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Social
              </h3>
            </div>
            <div className="flex gap-4 mb-8">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-neutral-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-neutral-300 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>

            <div className="border-t border-neutral-800 pt-6">
              {/* About Us */}
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  About Us
                </h3>
              </div>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="text-neutral-400 hover:text-white transition-colors uppercase">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/craftsmanship" className="text-neutral-400 hover:text-white transition-colors uppercase">
                    Craftsmanship
                  </Link>
                </li>
                <li>
                  <Link href="/garage" className="text-neutral-400 hover:text-white transition-colors uppercase">
                    The inventory
                  </Link>
                </li>
                <li>
                  <Link href="/vault" className="text-neutral-400 hover:text-white transition-colors uppercase">
                    The Vault
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <LinkIcon className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Quick Links
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <Link href="/" className="text-neutral-400 hover:text-white transition-colors uppercase">
                Home
              </Link>
              <Link href="/care" className="text-neutral-400 hover:text-white transition-colors uppercase">
                Care
              </Link>
              <Link href="/stores" className="text-neutral-400 hover:text-white transition-colors uppercase">
                Store Locator
              </Link>
              <Link href="/faq" className="text-neutral-400 hover:text-white transition-colors uppercase">
                FAQ
              </Link>
              <Link href="/returns" className="text-neutral-400 hover:text-white transition-colors uppercase">
                Return and Exchange Portal
              </Link>
              <Link href="/terms" className="text-neutral-400 hover:text-white transition-colors uppercase">
                T&C
              </Link>
              <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors uppercase">
                Contact Us
              </Link>
              <Link href="/returns-policy" className="text-neutral-400 hover:text-white transition-colors uppercase">
                Return & Exchanges Policy
              </Link>
              <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors uppercase">
                Privacy Policy
              </Link>
              <Link href="/refund" className="text-neutral-400 hover:text-white transition-colors uppercase">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-neutral-500 text-center">
            © {currentYear},{" "}
            <a href="#" className="underline hover:text-neutral-400">
              Grails Marketing Private Limited
            </a>
            . All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

