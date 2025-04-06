import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileText, MoreHorizontal, Eye } from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export const Route = createFileRoute('/tenant/penjualan/sales-invoice')({
  component: RouteComponent,
})

interface CartItem {
  id: string;
  productId: number;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  total: number;
}

type PaymentTiming = 'immediate' | 'scheduled';
type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'canceled' | 'refunded' | 'partially-paid';

interface PaymentDetails {
  timing: PaymentTiming;
  amount: number;
  dueDate?: string;
  reference?: string;
}

interface Invoice {
  id: string;
  date: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  serviceCharge: number;
  total: number;
  payment: PaymentDetails;
  status: InvoiceStatus;
}

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
  
  // Dummy invoice data
  const dummyInvoices: Invoice[] = [
    {
      id: "INV-230401",
      date: "2025-03-28T09:30:00Z",
      customerName: "John Doe",
      items: [
        {
          id: "1",
          productId: 1,
          name: "Paracetamol 500mg",
          unit: "Strip",
          price: 2000,
          quantity: 3,
          total: 6000
        },
        {
          id: "2",
          productId: 3,
          name: "Ibuprofen 400mg",
          unit: "Strip",
          price: 2500,
          quantity: 2,
          total: 5000
        }
      ],
      subtotal: 11000,
      discount: 0,
      serviceCharge: 0,
      total: 11000,
      payment: {
        timing: 'immediate',
        amount: 11000
      },
      status: 'paid'
    },
    {
      id: "INV-230402",
      date: "2025-03-29T10:15:00Z",
      customerName: "Jane Smith",
      items: [
        {
          id: "3",
          productId: 2,
          name: "Paracetamol 500mg",
          unit: "Box",
          price: 10000,
          quantity: 1,
          total: 10000
        }
      ],
      subtotal: 10000,
      discount: 0,
      serviceCharge: 500,
      total: 10500,
      payment: {
        timing: 'scheduled',
        amount: 10500,
        dueDate: "2025-04-29T00:00:00Z"
      },
      status: 'pending'
    },
    {
      id: "INV-230403",
      date: "2025-03-15T14:20:00Z",
      customerName: "Robert Johnson",
      items: [
        {
          id: "4",
          productId: 6,
          name: "Amoxicillin 500mg",
          unit: "Box",
          price: 15000,
          quantity: 1,
          total: 15000
        },
        {
          id: "5",
          productId: 5,
          name: "Amoxicillin 500mg",
          unit: "Strip",
          price: 3000,
          quantity: 2,
          total: 6000
        }
      ],
      subtotal: 21000,
      discount: 1000,
      serviceCharge: 0,
      total: 20000,
      payment: {
        timing: 'scheduled',
        amount: 20000,
        dueDate: "2025-03-30T00:00:00Z"
      },
      status: 'overdue'
    },
    {
      id: "INV-230404",
      date: "2025-03-30T16:45:00Z",
      customerName: "Mary Wilson",
      items: [
        {
          id: "6",
          productId: 4,
          name: "Ibuprofen 400mg",
          unit: "Box",
          price: 12000,
          quantity: 1,
          total: 12000
        }
      ],
      subtotal: 12000,
      discount: 1200,
      serviceCharge: 0,
      total: 10800,
      payment: {
        timing: 'immediate',
        amount: 10800,
        reference: "CC-78901234"
      },
      status: 'paid'
    },
    {
      id: "INV-230405",
      date: "2025-03-31T11:20:00Z",
      customerName: "David Brown",
      items: [
        {
          id: "7",
          productId: 1,
          name: "Paracetamol 500mg",
          unit: "Strip",
          price: 2000,
          quantity: 2,
          total: 4000
        },
        {
          id: "8",
          productId: 3,
          name: "Ibuprofen 400mg",
          unit: "Strip",
          price: 2500,
          quantity: 1,
          total: 2500
        }
      ],
      subtotal: 6500,
      discount: 0,
      serviceCharge: 0,
      total: 6500,
      payment: {
        timing: 'immediate',
        amount: 6500,
        reference: "DC-45678901"
      },
      status: 'refunded'
    }
  ];

  // Filter invoices based on search query and status
  const filteredInvoices = dummyInvoices.filter(invoice => {
    const matchesSearch = (
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetails(true);
  };
  
  const handlePayInvoice = (invoice: Invoice) => {
    // In a real application, this would open a payment processing flow
    toast.success(`Processing payment for invoice ${invoice.id}`);
  };
  
  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-600">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-blue-600">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-600">Overdue</Badge>;
      case 'canceled':
        return <Badge className="bg-gray-600">Canceled</Badge>;
      case 'refunded':
        return <Badge className="bg-orange-600">Refunded</Badge>;
      case 'partially-paid':
        return <Badge className="bg-purple-600">Partially Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales Invoices</h1>
          <p className="text-muted-foreground">View and manage all sales invoices</p>
        </div>
      </div>
      
      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices by ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select 
          className="px-3 py-2 rounded-md border border-input bg-background"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as InvoiceStatus | 'all')}
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
          <option value="canceled">Canceled</option>
          <option value="refunded">Refunded</option>
          <option value="partially-paid">Partially Paid</option>
        </select>
      </div>
      
      {/* Invoices Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No invoices found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell className="text-right font-mono">
                    {invoice.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {invoice.payment.timing}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        {invoice.status === 'pending' || invoice.status === 'overdue' ? (
                          <DropdownMenuItem onClick={() => handlePayInvoice(invoice)}>
                            <FileText className="mr-2 h-4 w-4" /> Process Payment
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Invoice Details Dialog */}
      <Dialog open={showInvoiceDetails} onOpenChange={setShowInvoiceDetails}>
        <DialogContent className="max-w-3xl pr-8">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center pr-6">
              <span>Invoice {selectedInvoice?.id}</span>
              {selectedInvoice && getStatusBadge(selectedInvoice.status)}
            </DialogTitle>
            <DialogDescription>
              Created on {selectedInvoice ? formatDate(selectedInvoice.date) : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Customer</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p>{selectedInvoice.customerName}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p><span className="capitalize">{selectedInvoice.payment.timing}</span></p>
                    {selectedInvoice.payment.reference && (
                      <p className="text-sm text-muted-foreground">Ref: {selectedInvoice.payment.reference}</p>
                    )}
                    {selectedInvoice.payment.timing === 'scheduled' && selectedInvoice.payment.dueDate && (
                      <p className="text-sm text-muted-foreground">
                        Due: {formatDate(selectedInvoice.payment.dueDate)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="text-right font-mono">
                          {item.price.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right font-mono">
                          {item.total.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="space-y-2 ml-auto w-full max-w-xs">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">{selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="font-mono">-{selectedInvoice.discount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span className="font-mono">{selectedInvoice.serviceCharge.toLocaleString()}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="font-mono">{selectedInvoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
