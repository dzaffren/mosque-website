import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
    <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-4 gap-8 mb-8">
    {/* About */}
    <div>
    <h3 className="text-white font-semibold text-lg mb-4">Local Mosque</h3>
    <p className="text-sm leading-relaxed">
    Serving our community with faith, compassion, and dedication. Join us in worship and community building.
    </p>
    </div>
    
    {/* Quick Links */}
    <div>
    <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
    <ul className="space-y-2 text-sm">
    <li>
    <Link href="/prayer-times" className="hover:text-white transition-colors">
    Prayer Times
    </Link>
    </li>
    <li>
    <Link href="/friday-prayer" className="hover:text-white transition-colors">
    Friday Prayer
    </Link>
    </li>
    <li>
    <Link href="/schedule" className="hover:text-white transition-colors">
    Imam Schedule
    </Link>
    </li>
    <li>
    <Link href="/events" className="hover:text-white transition-colors">
    Events
    </Link>
    </li>
    </ul>
    </div>
    
    {/* Contact Info */}
    <div>
    <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
    <ul className="space-y-3 text-sm">
    <li className="flex items-start gap-2">
    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
    <span>
    123 Main Street
    <br />
    City, State 12345
    </span>
    </li>
    <li className="flex items-center gap-2">
    <Phone className="h-4 w-4 flex-shrink-0" />
    <span>(555) 123-4567</span>
    </li>
    <li className="flex items-center gap-2">
    <Mail className="h-4 w-4 flex-shrink-0" />
    <span>info@localmosque.org</span>
    </li>
    </ul>
    </div>
    
    {/* Office Hours */}
    <div>
    <h3 className="text-white font-semibold text-lg mb-4">Office Hours</h3>
    <ul className="space-y-2 text-sm">
    <li className="flex items-start gap-2">
    <Clock className="h-4 w-4 mt-1 flex-shrink-0" />
    <div>
    <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
    <p className="mt-1">Saturday - Sunday: After prayers</p>
    </div>
    </li>
    </ul>
    </div>
    </div>
    
    <div className="border-t border-slate-800 pt-8 text-center text-sm">
    <p>&copy; {new Date().getFullYear()} Local Mosque. All rights reserved.</p>
    {/* Discreet Admin Link */}
    <Link href="/admin" className="mt-2 inline-block text-xs text-slate-600 hover:text-emerald-500 transition-colors">
    Admin Login
    </Link>
    </div>
    </div>
    
    </footer>
  )
}
