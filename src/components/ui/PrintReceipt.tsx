'use client'

import { formatCurrency, formatDate } from '@/lib/utils'

interface ReceiptItem {
  product_name: string
  product_sku: string
  quantity: number
  unit_price: number
  subtotal: number
}

interface Receipt {
  id: number
  receipt_number: string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  amount_paid: number
  change_amount: number
  payment_method: string
  created_at: string
}

interface PrintReceiptProps {
  receipt: Receipt
  onClose: () => void
}

export function PrintReceipt({ receipt, onClose }: PrintReceiptProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:bg-white print:block print:relative print:inset-auto">
      <div className="print-receipt-content bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto print:shadow-none print:max-w-full print:max-h-full print:overflow-visible">
        {/* Print-only header */}
        <div className="hidden print:block text-center mb-6">
          <h1 className="text-3xl font-bold">ModernStore</h1>
          <p className="text-sm text-gray-600">Your trusted shopping partner</p>
          <p className="text-xs text-gray-500 mt-1">
            123 Main Street, City, State 12345 | Phone: (555) 123-4567
          </p>
        </div>

        {/* Screen-only header */}
        <div className="p-6 border-b print:hidden">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Receipt</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Receipt content */}
        <div className="p-6 print:p-8">
          {/* Receipt info */}
          <div className="mb-6 pb-4 border-b border-dashed">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Receipt #</p>
                <p className="font-semibold">{receipt.receipt_number}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Date</p>
                <p className="font-semibold">{formatDate(receipt.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Items table */}
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-sm font-semibold">Item</th>
                <th className="text-center py-2 text-sm font-semibold">Qty</th>
                <th className="text-right py-2 text-sm font-semibold">Price</th>
                <th className="text-right py-2 text-sm font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-xs text-gray-500">SKU: {item.product_sku}</p>
                  </td>
                  <td className="text-center py-3">{item.quantity}</td>
                  <td className="text-right py-3">{formatCurrency(item.unit_price)}</td>
                  <td className="text-right py-3 font-medium">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="space-y-2 mb-6 pb-6 border-b border-dashed">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(receipt.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (18%)</span>
              <span className="font-medium">{formatCurrency(receipt.tax)}</span>
            </div>
            {receipt.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span className="font-medium">-{formatCurrency(receipt.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(receipt.total)}</span>
            </div>
          </div>

          {/* Payment info */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium capitalize">{receipt.payment_method.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-medium">{formatCurrency(receipt.amount_paid)}</span>
            </div>
            {receipt.change_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Change</span>
                <span className="font-medium">{formatCurrency(receipt.change_amount)}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 pt-4 border-t">
            <p className="font-semibold mb-1">Thank you for your purchase!</p>
            <p className="text-xs">For any queries, please contact us at support@modernstore.com</p>
          </div>
        </div>

        {/* Action buttons (screen only) */}
        <div className="p-6 border-t flex gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Print Receipt
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

