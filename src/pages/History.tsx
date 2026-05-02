import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, ShieldAlert, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Transaction {
  id: string
  sender_id: string
  receiver_id: string
  amount: number
  channel: string
  is_fraud_flagged: boolean
  gateway_success: boolean
  error_message: string | null
  gateway_receipt: string | null
  created_at: string
}

export default function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTransactions = async () => {
    setLoading(true)
    setError('')

    try {
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (fetchError) throw fetchError
      setTransactions(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Transaction History</h1>
            <p className="mt-1 text-sm text-neutral-500">All transactions processed through NaijaPay</p>
          </div>
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-neutral-500">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-error-200 p-8 text-center">
            <XCircle className="w-10 h-10 text-error-500 mx-auto mb-3" />
            <p className="text-neutral-700 font-medium mb-1">Failed to load transactions</p>
            <p className="text-sm text-neutral-500 mb-4">{error}</p>
            <button onClick={fetchTransactions} className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors">
              Try Again
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <Clock className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-700 font-medium mb-1">No transactions yet</p>
            <p className="text-sm text-neutral-500 mb-4">Transactions will appear here after you send money.</p>
            <Link to="/transfer" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors">
              Send Your First Transfer
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">From</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">To</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Amount</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">AI Check</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-neutral-600 whitespace-nowrap">{formatDate(tx.created_at)}</td>
                      <td className="px-5 py-3.5 text-sm font-mono text-neutral-700">{tx.sender_id}</td>
                      <td className="px-5 py-3.5 text-sm font-mono text-neutral-700">{tx.receiver_id}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-neutral-900 text-right whitespace-nowrap">{formatAmount(tx.amount)}</td>
                      <td className="px-5 py-3.5 text-center">
                        {tx.is_fraud_flagged ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-error-50 text-error-600 text-xs font-medium rounded-full">
                            <ShieldAlert className="w-3 h-3" />
                            Flagged
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success-50 text-success-600 text-xs font-medium rounded-full">
                            <Shield className="w-3 h-3" />
                            Clear
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {tx.gateway_success ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success-50 text-success-600 text-xs font-medium rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-error-50 text-error-600 text-xs font-medium rounded-full">
                            <XCircle className="w-3 h-3" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-mono text-neutral-500">
                        {tx.gateway_receipt || tx.error_message || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-neutral-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-900">{formatAmount(tx.amount)}</span>
                    {tx.gateway_success ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success-50 text-success-600 text-xs font-medium rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-error-50 text-error-600 text-xs font-medium rounded-full">
                        <XCircle className="w-3 h-3" />
                        Failed
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-neutral-400">From</span>
                      <p className="font-mono text-neutral-700">{tx.sender_id}</p>
                    </div>
                    <div>
                      <span className="text-neutral-400">To</span>
                      <p className="font-mono text-neutral-700">{tx.receiver_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">{formatDate(tx.created_at)}</span>
                    {tx.is_fraud_flagged ? (
                      <span className="inline-flex items-center gap-1 text-error-600">
                        <ShieldAlert className="w-3 h-3" />
                        AI Flagged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-success-600">
                        <Shield className="w-3 h-3" />
                        AI Clear
                      </span>
                    )}
                  </div>
                  {tx.gateway_receipt && (
                    <div className="text-xs font-mono text-neutral-500">Receipt: {tx.gateway_receipt}</div>
                  )}
                  {tx.error_message && (
                    <div className="text-xs text-error-500">{tx.error_message}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-500 text-center">
              Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
