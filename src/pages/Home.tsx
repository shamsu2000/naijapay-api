import { Link } from 'react-router-dom'
import {
  Shield, Zap, Globe, Lock, ArrowRight, CheckCircle2,
  Send, Brain, BarChart3
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const features = [
  {
    icon: Brain,
    title: 'AI Fraud Detection',
    description: 'Machine learning models analyze every transaction in real-time, blocking suspicious activity before it reaches the gateway.',
    color: 'bg-primary-50 text-primary-600',
  },
  {
    icon: Zap,
    title: 'Instant Transfers',
    description: 'Process payments through Paystack and Flutterwave gateways with sub-second routing and confirmation.',
    color: 'bg-accent-50 text-accent-600',
  },
  {
    icon: Lock,
    title: 'Bank-Grade Security',
    description: 'End-to-end encryption, secure tokenization, and multi-layer authentication protect every naira.',
    color: 'bg-success-50 text-success-600',
  },
  {
    icon: Globe,
    title: 'Pan-African Reach',
    description: 'Send money across Nigeria and beyond. Our infrastructure connects to every major Nigerian bank.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track transaction patterns, monitor fraud rates, and gain insights from your payment data dashboard.',
    color: 'bg-warning-50 text-warning-600',
  },
  {
    icon: Send,
    title: 'Simple API',
    description: 'Integrate NaijaPay into your app with a single endpoint. RESTful API with comprehensive documentation.',
    color: 'bg-rose-50 text-rose-600',
  },
]

const steps = [
  {
    number: '01',
    title: 'Initiate Transfer',
    description: 'Enter sender, receiver, and amount. Our API accepts transactions from web, mobile, or backend channels.',
  },
  {
    number: '02',
    title: 'AI Security Check',
    description: 'Our Isolation Forest model evaluates amount, timing, and velocity to detect anomalies in milliseconds.',
  },
  {
    number: '03',
    title: 'Gateway Processing',
    description: 'Approved transactions route through Paystack or Flutterwave for bank-level processing and settlement.',
  },
  {
    number: '04',
    title: 'Confirmation & Receipt',
    description: 'Receive instant confirmation with a gateway reference. Full audit trail logged for compliance.',
  },
]

const stats = [
  { value: '99.7%', label: 'Uptime' },
  { value: '<200ms', label: 'Avg Response' },
  { value: '50K+', label: 'Transactions' },
  { value: '0', label: 'Fraud Breaches' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-900 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-500 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-300 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
                AI-Powered Payment Infrastructure
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight animate-fade-in-up delay-100">
              Secure Payments,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">
                Intelligent
              </span>{' '}
              Protection
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-2xl animate-fade-in-up delay-200">
              NaijaPay combines AI fraud detection with Nigeria's top payment gateways to deliver secure, instant money transfers for businesses and individuals.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <Link
                to="/transfer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all hover:shadow-lg hover:shadow-primary-600/25 active:scale-[0.98]"
              >
                Send Money Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm text-neutral-400 animate-fade-in-up delay-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary-400" />
                No setup fees
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary-400" />
                Real-time processing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary-400" />
                24/7 monitoring
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-neutral-900">{stat.value}</div>
                <div className="mt-1 text-sm text-neutral-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-neutral-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
              Built for Secure, Intelligent Payments
            </h2>
            <p className="mt-4 text-lg text-neutral-500">
              Every feature is designed to keep your money safe while making transfers effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl p-7 border border-neutral-200 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-50 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color} mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
              How NaijaPay Works
            </h2>
            <p className="mt-4 text-lg text-neutral-500">
              From initiation to confirmation in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px border-t-2 border-dashed border-neutral-200" />
                )}
                <div className="text-5xl font-bold text-primary-100 mb-4">{step.number}</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Fraud Section */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-900 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-300 text-xs font-medium mb-6">
                <Shield className="w-3.5 h-3.5" />
                AI-Powered Security
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Fraud Detection That Learns
              </h2>
              <p className="mt-4 text-neutral-300 leading-relaxed">
                Our Isolation Forest model analyzes transaction patterns in real-time. It detects anomalies in amount, timing, and velocity that rule-based systems miss.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Anomaly detection on amount, hour, and velocity',
                  'Real-time scoring with sub-millisecond latency',
                  'Continuous learning from transaction patterns',
                  'Zero false-negative tolerance for high-risk patterns',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-primary-400 mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl border border-neutral-700 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-error-500" />
                <div className="w-3 h-3 rounded-full bg-warning-500" />
                <div className="w-3 h-3 rounded-full bg-success-500" />
                <span className="ml-2 text-xs text-neutral-500 font-mono">fraud_model.predict()</span>
              </div>
              <pre className="text-sm font-mono text-neutral-300 overflow-x-auto">
{`# Transaction Analysis
Input:
  amount:    ₦800,000
  hour:      03:00 AM
  velocity:  20 txns/hr

Model Output:
  prediction: -1 (ANOMALY)
  confidence: 0.94

Action: BLOCKED
Reason: High amount + unusual hour
        + extreme velocity pattern`}
              </pre>
              <div className="mt-4 px-3 py-2 bg-error-500/10 border border-error-500/20 rounded-lg">
                <span className="text-xs font-semibold text-error-400">
                  TRANSACTION BLOCKED - Suspicious activity detected
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Start Sending Money Securely
          </h2>
          <p className="mt-4 text-lg text-primary-100 max-w-xl mx-auto">
            Join thousands of Nigerians who trust NaijaPay for secure, AI-protected money transfers.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/transfer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all hover:shadow-lg active:scale-[0.98]"
            >
              Send Money Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-400 transition-all border border-primary-400"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-neutral-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                Get In Touch
              </h2>
              <p className="mt-4 text-lg text-neutral-500">
                Have questions about NaijaPay? We'd love to hear from you.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const data = {
                  name: (form.elements as any).name.value,
                  email: (form.elements as any).email.value,
                  company: (form.elements as any).company.value,
                  message: (form.elements as any).message.value,
                }

                const { error } = await supabase.from('contact_leads').insert(data)

                if (!error) {
                  alert('Message sent! We will get back to you soon.')
                  form.reset()
                } else {
                  alert('Something went wrong. Please try again.')
                }
              }}
              className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name</label>
                  <input
                    name="name"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Company</label>
                <input
                  name="company"
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Your company (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                  placeholder="Tell us about your needs..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all hover:shadow-md active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
