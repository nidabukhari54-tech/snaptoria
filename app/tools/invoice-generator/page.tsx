'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { ToolLayout } from '@/components/tool-layout'
import { tools } from '@/lib/tools'
import { Download, Plus, Trash2, FileText } from 'lucide-react'
import { jsPDF } from 'jspdf'

interface LineItem {
  id: string
  description: string
  quantity: number
  price: number
}

export default function InvoiceGeneratorPage() {
  const tool = tools.find((t) => t.id === 'invoice-generator')!
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`)
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [fromName, setFromName] = useState('')
  const [fromAddress, setFromAddress] = useState('')
  const [toName, setToName] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, price: 0 }
  ])
  const [notes, setNotes] = useState('')
  const [taxRate, setTaxRate] = useState(0)

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
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax

  const generatePDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header
    doc.setFontSize(24)
    doc.setTextColor(59, 130, 246)
    doc.text('INVOICE', pageWidth / 2, 25, { align: 'center' })

    // Invoice details
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Invoice #: ${invoiceNumber}`, 20, 45)
    doc.text(`Date: ${invoiceDate}`, 20, 52)
    if (dueDate) doc.text(`Due: ${dueDate}`, 20, 59)

    // From/To
    doc.setFontSize(10)
    doc.setTextColor(40, 40, 40)
    doc.text('From:', 20, 75)
    doc.text(fromName, 20, 82)
    doc.text(fromAddress, 20, 89)

    doc.text('Bill To:', 120, 75)
    doc.text(toName, 120, 82)
    doc.text(toAddress, 120, 89)

    // Table header
    let y = 110
    doc.setFillColor(248, 250, 252)
    doc.rect(20, y - 5, pageWidth - 40, 10, 'F')
    doc.setTextColor(100, 100, 100)
    doc.text('Description', 25, y + 2)
    doc.text('Qty', 120, y + 2)
    doc.text('Price', 145, y + 2)
    doc.text('Total', 170, y + 2)

    // Line items
    y += 15
    doc.setTextColor(40, 40, 40)
    lineItems.forEach((item) => {
      doc.text(item.description || '-', 25, y)
      doc.text(item.quantity.toString(), 120, y)
      doc.text(`$${item.price.toFixed(2)}`, 145, y)
      doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 170, y)
      y += 10
    })

    // Totals
    y += 10
    doc.line(100, y - 5, pageWidth - 20, y - 5)
    doc.text('Subtotal:', 120, y + 5)
    doc.text(`$${subtotal.toFixed(2)}`, 170, y + 5)

    if (taxRate > 0) {
      y += 8
      doc.text(`Tax (${taxRate}%):`, 120, y + 5)
      doc.text(`$${tax.toFixed(2)}`, 170, y + 5)
    }

    y += 15
    doc.setFontSize(12)
    doc.setTextColor(59, 130, 246)
    doc.text('Total:', 120, y)
    doc.text(`$${total.toFixed(2)}`, 170, y)

    // Notes
    if (notes) {
      y += 20
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text('Notes:', 20, y)
      y += 7
      doc.text(notes, 20, y, { maxWidth: pageWidth - 40 })
    }

    doc.save(`invoice-${invoiceNumber}.pdf`)
  }

  return (
    <ToolLayout tool={tool}>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Invoice Number</Label>
                <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
              </div>
              <div>
                <Label>Invoice Date</Label>
                <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Due Date (optional)</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>From - Business Name</Label>
                <Input value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Your business name" />
                <Label className="mt-2">Address</Label>
                <Textarea value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} placeholder="Your address" />
              </div>
              <div>
                <Label>Bill To - Client Name</Label>
                <Input value={toName} onChange={(e) => setToName(e.target.value)} placeholder="Client name" />
                <Label className="mt-2">Address</Label>
                <Textarea value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder="Client address" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg">Line Items</Label>
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
                        placeholder="Description"
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
                        placeholder="0.00"
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

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Payment terms, thank you message, etc."
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span>Tax ({taxRate}%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={generatePDF}
              className="w-full bg-sky-500 hover:bg-sky-600"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Invoice PDF
              <Download className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
