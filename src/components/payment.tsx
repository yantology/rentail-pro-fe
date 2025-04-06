import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from 'lucide-react'

export type PaymentTiming = 'immediate' | 'delay'

interface PaymentDetails {
  timing: PaymentTiming
  amount: number
  dueDate?: string // ISO date string for delayed payments
  reference?: string // Reference number, receipt number, etc.
}

interface PaymentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalAmount: number
  onPaymentComplete: (paymentDetails: PaymentDetails) => void
}

export function PaymentComponent({
  open,
  onOpenChange,
  totalAmount,
  onPaymentComplete
}: PaymentProps) {
  const [paymentTiming, setPaymentTiming] = useState<PaymentTiming>('immediate')
  const [amountPaid, setAmountPaid] = useState<number>(totalAmount)
  const [dueDate, setDueDate] = useState<string>('')
  const [reference, setReference] = useState<string>('')
  const [formError, setFormError] = useState<string>('')

  const handlePaymentSubmit = () => {
    // Validation
    if (paymentTiming === 'immediate' && amountPaid < totalAmount) {
      setFormError('Payment amount must be at least equal to the total amount')
      return
    }
    
    if (paymentTiming === 'delay' && !dueDate) {
      setFormError('Please select a due date for delayed payment')
      return
    }

    // Create payment details object
    const paymentDetails: PaymentDetails = {
      timing: paymentTiming,
      amount: paymentTiming === 'immediate' ? amountPaid : 0,
      ...(paymentTiming === 'delay' && { dueDate }),
      ...(reference && { reference })
    }

    // Call the callback function
    onPaymentComplete(paymentDetails)
    
    // Reset form
    setPaymentTiming('immediate')
    setAmountPaid(totalAmount)
    setDueDate('')
    setReference('')
    setFormError('')
  }

  const getChange = () => {
    return Math.max(0, amountPaid - totalAmount)
  }

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  // Get tomorrow's date for minimum due date
  const getTomorrow = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return formatDate(tomorrow)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Complete the transaction by processing payment or setting up a delayed payment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center font-medium">
            <span>Total Amount:</span>
            <span className="font-mono text-lg">{totalAmount.toLocaleString()}</span>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="payment-timing">Payment Timing</Label>
            <RadioGroup 
              id="payment-timing" 
              value={paymentTiming}
              onValueChange={(value) => setPaymentTiming(value as PaymentTiming)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate">Pay now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delay" id="delay" />
                <Label htmlFor="delay">Pay later (create invoice)</Label>
              </div>
            </RadioGroup>
          </div>
          
          {paymentTiming === 'immediate' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount-paid">Amount Paid</Label>
                <Input
                  id="amount-paid"
                  type="number"
                  min={totalAmount}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="font-mono"
                />
              </div>
              
              {amountPaid >= totalAmount && (
                <div className="flex justify-between items-center">
                  <span>Change:</span>
                  <span className="font-mono font-medium">{getChange().toLocaleString()}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="reference">
                  Reference (optional)
                </Label>
                <Input
                  id="reference"
                  placeholder="Receipt number, transaction ID, etc."
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="due-date" className="flex items-center">
                  Due Date <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="due-date"
                    type="date"
                    min={getTomorrow()}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reference">
                  Reference / Invoice Number (optional)
                </Label>
                <Input
                  id="reference"
                  placeholder="Invoice number or reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
            </>
          )}
          
          {formError && (
            <p className="text-sm text-red-500">{formError}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePaymentSubmit}>
            {paymentTiming === 'immediate' ? 'Complete Payment' : 'Create Invoice'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}