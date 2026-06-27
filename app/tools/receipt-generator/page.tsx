'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Plus, Trash2, Receipt } from 'lucide-react'
import { jsPDF } from 'jspdf'

interface LineItem {
  id: string
  description: string
  quantity: number
  price: number
}

export default function ReceiptGeneratorPage() {
  const tool = tools.find((t) => t.id === 'receipt-generator')!
  const [receiptNumber, setReceiptNumber] = useState(`RCP-${Date.now().toString().slice(-6)}`)
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0])
  const [businessName, setBusinessName] = useState('')
  const [businessAddress, setBusinessAddress] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, price: 0 }
  ])
  const [notes, setNotes] = useState('')

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: '', quantity: 1, price: 0 }
    ])
  }

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0)

  const generatePDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header
    doc.setFontSize(28)
    doc.setTextColor(40, 40, 40)
    doc.text('RECEIPT', pageWidth / 2, 30, { align: 'center' })

    // Business info
    doc.setFontSize(14)
    doc.setTextColor(59, 130, 246)
    doc.text(businessName || 'Your Business', pageWidth / 2, 45, { align: 'center' })

    if (businessAddress) {
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      const addressLines = businessAddress.split('\n')
      addressLines.forEach((line, i) => {
        doc.text(line, pageWidth / 2, 52 + i * 5, { align: 'center' })
      })
    }

    // Receipt details
    let y = businessAddress ? 72 : 60
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    doc.text(`Receipt #: ${receiptNumber}`, 20, y)
    doc.text(`Date: ${receiptDate}`, pageWidth - 20, y, { align: 'right' })

    y += 10
    doc.text(`Customer: ${customerName || 'N/A'}`, 20, y)
    doc.text(`Payment: ${paymentMethod}`, pageWidth - 20, y, { align: 'right' })

    // Divider
    y += 10
    doc.setDrawColor(200, 200, 200)
    doc.line(20, y, pageWidth - 20, y)

    // Line items
    y += 15
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Item', 20, y)
    doc.text('Qty', 100, y)
    doc.text('Price', 130, y)
    doc.text('Amount', 160, y)

    y += 8
    doc.setDrawColor(230, 230, 230)
    doc.line(20, y, pageWidth - 20, y)

    y += 10
    doc.setTextColor(40, 40, 40)
    lineItems.forEach((item) => {
      doc.text(item.description || '-', 20, y)
      doc.text(item.quantity.toString(), 100, y)
      doc.text(`$${item.price.toFixed(2)}`, 130, y)
      doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 160, y)
      y += 8
    })

    // Total
    y += 5
    doc.setDrawColor(40, 40, 40)
    doc.setLineWidth(0.5)
    doc.line(20, y, pageWidth - 20, y)

    y += 15
    doc.setFontSize(14)
    doc.setTextColor(59, 130, 246)
    doc.text('TOTAL:', 100, y)
    doc.text(`$${subtotal.toFixed(2)}`, 160, y)

    // Notes
    if (notes) {
      y += 20
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text('Notes:', 20, y)
      y += 6
      doc.text(notes, 20, y, { maxWidth: pageWidth - 40 })
    }

    // Footer
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text('Thank you for your business!', pageWidth / 2, doc.internal.pageSize.getHeight() - 20, { align: 'center' })

    doc.save(`receipt-${receiptNumber}.pdf`)
  }

  return (
    <ToolLayout tool={tool}>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Receipt Number</Label>
                <Input value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Business Name</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your business name" />
              <Label className="mt-2">Business Address</Label>
              <Textarea value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="Your business address" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Customer Name (optional)</Label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} placeholder="Cash, Card, etc." />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg">Items</Label>
                <Button variant="outline" size="sm" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-3">
                {lineItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        placeholder="Item"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateLineItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="Price"
                      />
                    </div>
                    <div className="col-span-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length === 1}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Notes (optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Return policy, special instructions, etc."
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={generatePDF}
              className="w-full bg-sky-500 hover:bg-sky-600"
            >
              <Receipt className="h-4 w-4 mr-2" />
              Generate Receipt PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
