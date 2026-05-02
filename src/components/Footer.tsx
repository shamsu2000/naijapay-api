import { Link } from 'react-router-dom'
import { Shield, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Naija<span className="text-primary-400">Pay</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              AI-powered payment infrastructure for Nigeria and beyond. Secure, fast, and intelligent money transfers.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/transfer" className="hover:text-primary-400 transition-colors">Send Money</Link></li>
              <li><Link to="/history" className="hover:text-primary-400 transition-colors">Transaction History</Link></li>
              <li><a href="#features" className="hover:text-primary-400 transition-colors">AI Fraud Detection</a></li>
              <li><a href="#how-it-works" className="hover:text-primary-400 transition-colors">API Integration</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-primary-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                hello@naijapay.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400" />
                +234 800 NAIJA PAY
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} NaijaPay. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-neutral-500">
            <a href="#" className="hover:text-neutral-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
