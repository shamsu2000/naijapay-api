import { useState } from 'react'
import { Send, Shield, AlertTriangle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type TransferStatus = 'idle' | 'loading' | 'success' | 'fraud' | 'failed' | 'error'

interface TransferResult {
  status: TransferStatus
  message: string
  receipt?: string
}

export default function Transfer() {
  const [senderId, setSenderId] = useState('user_001')
  const [receiverId, setReceiverId] = useState('')
  const [amount, setAmount] = useState('')
  const [channel, setChannel] = useState('Web App')
  const [transferStatus, setTransferStatus] = useState<TransferStatus>('idle')
  const [result, setResult] = useState<TransferResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!receiverId || !amount) return

    setTransferStatus('loading')
    setResult(null)

    try {
      const { data, error } = await supabase.functions.invoke('process-transfer', {
        body: {
          sender_id: senderId,
          receiver_id: receiverId,
          amount: parseFloat(amount),
          channel,
          hour: new Date().getHours(),
          velocity: 1,
        },
      })

      if (error) {
        const detail = data?.detail || data?.message || 'Transaction failed'
        if (detail.toLowerCase().includes('fraud') || detail.toLowerCase().includes('suspicious') || detail.toLowerCase().includes('blocked')) {
          setTransferStatus('fraud')
          setResult({ status: 'fraud', message: detail })
        } else if (detail.toLowerCase().includes('gateway') || detail.toLowerCase().includes('timeout') || detail.toLowerCase().includes('insufficient')) {
          setTransferStatus('failed')
          setResult({ status: 'failed', message: detail })
        } else {
          setTransferStatus('error')
          setResult({ status: 'error', message: detail })
        }
        return
      }

      setTransferStatus('success')
      setResult({
        status: 'success',
        message: data.message || `₦${amount} transferred to ${receiverId}`,
        receipt: data.gateway_receipt,
      })
    } catch (err) {
      setTransferStatus('error')
      setResult({ status: 'error', message: 'Network error. Please try again.' })
    }
  }

  const resetForm = () => {
    setTransferStatus('idle')
    setResult(null)
    setReceiverId('')
    setAmount('')
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Send Money</h1>
                <p className="text-primary-100 text-xs">AI-protected transfer</p>
              </div>
            </div>
          </div>

          {/* Form */}
          {transferStatus === 'idle' || transferStatus === 'loading' ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Your Account ID</label>
                <input
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="e.g., user_001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Receiver Account ID</label>
                <input
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="e.g., merchant_99"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Amount (Naira)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">&#8358;</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="0.00"
                    min="100"
                    step="100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                >
                  <option>Web App</option>
                  <option>Mobile App</option>
                  <option>API</option>
                </select>
              </div>

              <div className="flex items-center gap-2 px-3 py-2.5 bg-primary-50 rounded-lg text-xs text-primary-700">
                <Shield className="w-4 h-4 shrink-0" />
                <span>Every transfer is screened by our AI fraud detection system</span>
              </div>

              <button
                type="submit"
                disabled={transferStatus === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {transferStatus === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing & AI Security Check...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Money
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="p-6">
              {/* Success */}
              {transferStatus === 'success' && (
                <div className="text-center animate-fade-in-up">
                  <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                    <CheckCircle2 className="w-8 h-8 text-success-500" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-1">Transfer Successful</h2>
                  <p className="text-sm text-neutral-500 mb-4">{result?.message}</p>
                  {result?.receipt && (
                    <div className="bg-neutral-50 rounded-lg px-4 py-3 mb-6">
                      <span className="text-xs text-neutral-500 block">Receipt Reference</span>
                      <span className="text-sm font-mono font-semibold text-neutral-900">{result.receipt}</span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={resetForm} className="flex-1 px-4 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors text-sm">
                      Send Another
                    </button>
                    <Link to="/history" className="flex-1 px-4 py-2.5 bg-neutral-100 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-200 transition-colors text-sm text-center">
                      View History
                    </Link>
                  </div>
                </div>
              )}

              {/* Fraud Blocked */}
              {transferStatus === 'fraud' && (
                <div className="text-center animate-fade-in-up">
                  <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-error-500" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-1">Transaction Blocked</h2>
                  <p className="text-sm text-neutral-500 mb-2">{result?.message}</p>
                  <p className="text-xs text-neutral-400 mb-6">Our AI detected suspicious activity patterns in this transaction.</p>
                  <button onClick={resetForm} className="px-6 py-2.5 bg-neutral-100 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-200 transition-colors text-sm">
                    Try Again
                  </button>
                </div>
              )}

              {/* Gateway Failed */}
              {transferStatus === 'failed' && (
                <div className="text-center animate-fade-in-up">
                  <div className="w-16 h-16 bg-warning-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-warning-500" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-1">Gateway Error</h2>
                  <p className="text-sm text-neutral-500 mb-2">{result?.message}</p>
                  <p className="text-xs text-neutral-400 mb-6">The payment gateway could not process this transaction. Please try again.</p>
                  <button onClick={resetForm} className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors text-sm">
                    Retry Transfer
                  </button>
                </div>
              )}

              {/* Network Error */}
              {transferStatus === 'error' && (
                <div className="text-center animate-fade-in-up">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-1">Connection Error</h2>
                  <p className="text-sm text-neutral-500 mb-6">{result?.message}</p>
                  <button onClick={resetForm} className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors text-sm">
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
