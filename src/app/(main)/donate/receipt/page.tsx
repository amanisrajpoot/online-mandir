import * as React from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PrintReceiptClient } from "./PrintReceiptClient"
import Link from "next/link"
import { ArrowLeft, Printer } from "lucide-react"

export default async function ReceiptPage(props: { searchParams: Promise<{ order_id?: string }> }) {
  const searchParams = await props.searchParams
  const orderId = searchParams.order_id

  if (!orderId) {
    return notFound()
  }

  const supabase = await createClient()

  // Fetch the donation order
  const { data: order, error } = await supabase
    .from('donation_orders')
    .select(`
      *,
      donations (
        title,
        category
      )
    `)
    .eq('id', orderId)
    .single()

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Receipt Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the receipt for this order.</p>
        <Link href="/" className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium">
          Return Home
        </Link>
      </div>
    )
  }

  // Determine email if stored in donor_message
  let customerEmail = "Not provided"
  if (order.user_id) {
    const { data: userData } = await supabase.auth.admin.getUserById(order.user_id)
    if (userData.user?.email) customerEmail = userData.user.email
  } else if (order.donor_message?.includes('| EMAIL:')) {
    customerEmail = order.donor_message.split('| EMAIL:')[1].trim()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl mb-4 flex justify-between items-center print:hidden">
        <Link href={`/donate/confirmation?cf_id=${order.id}&order_id=${order.id}`} className="text-gray-600 hover:text-orange-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <PrintReceiptClient />
      </div>

      <div id="receipt-content" className="w-full max-w-2xl bg-white p-8 md:p-12 shadow-lg rounded-xl border border-gray-200 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none print:text-black">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-600 font-serif">VANDANAM</h1>
            <p className="text-sm text-gray-500 mt-1">Connecting Devotees to the Divine</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider">Donation Receipt</h2>
            <p className="text-sm text-gray-500 mt-1">Date: {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-xs text-gray-400 mt-1">Order ID: {order.id.split('-')[0].toUpperCase()}</p>
          </div>
        </div>

        {/* Donor Info & Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Donor Details</h3>
            <p className="font-semibold text-gray-800">{order.donor_name || 'Anonymous Devotee'}</p>
            {order.customer_phone && <p className="text-sm text-gray-600">+91 {order.customer_phone}</p>}
            {customerEmail !== "Not provided" && <p className="text-sm text-gray-600">{customerEmail}</p>}
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Status</h3>
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${order.status === 'SUCCESS' || order.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {order.status === 'SUCCESS' || order.status === 'success' ? 'SUCCESSFUL' : order.status}
            </span>
          </div>
        </div>

        {/* Donation Details Table */}
        <div className="mb-8 rounded-lg overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4">
                  <p className="font-bold text-gray-800">{order.donations?.title || 'General Donation'}</p>
                  <p className="text-xs text-gray-500 mt-1">Donation Category: {order.donations?.category || 'N/A'}</p>
                  {order.donor_message && !order.donor_message.includes('| EMAIL:') && (
                    <p className="text-xs text-gray-600 mt-2 italic">"{order.donor_message}"</p>
                  )}
                  {order.donor_message && order.donor_message.includes('| EMAIL:') && order.donor_message.split('| EMAIL:')[0].trim() && (
                    <p className="text-xs text-gray-600 mt-2 italic">"{order.donor_message.split('| EMAIL:')[0].trim()}"</p>
                  )}
                </td>
                <td className="py-4 px-4 text-right font-semibold text-gray-800">
                  ₹{order.amount?.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td className="py-4 px-4 text-right font-bold text-gray-800 uppercase tracking-wider text-sm">Total Contribution</td>
                <td className="py-4 px-4 text-right font-extrabold text-orange-600 text-xl">
                  ₹{order.amount?.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 pt-6 border-t border-gray-100 print:border-gray-800">
          <p className="text-sm font-semibold text-gray-800 print:text-black">Thank you for your generous contribution.</p>
          <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed print:text-black">
            This is a computer-generated receipt and does not require a physical signature. Vandanam ensures that 100% of your donation reaches the intended cause.
          </p>
        </div>
      </div>
    </div>
  )
}
