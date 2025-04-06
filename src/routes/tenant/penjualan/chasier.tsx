import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Search, Trash2 } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { PaymentComponent, type PaymentTiming } from '@/components/payment'
import { toast } from "sonner"

export const Route = createFileRoute('/tenant/penjualan/chasier')({
  component: RouteComponent,
})

interface Product {
  id: number;
  name: string;
  sku: string;
  units: string;
  price : number;
}


interface CartItem {
  id: string;
  productId: number;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  total: number;
}

interface PaymentDetails {
  timing: PaymentTiming;
  amount: number;
  dueDate?: string;
  reference?: string;
}

interface Receipt {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  serviceCharge: number;
  total: number;
  payment: PaymentDetails;
}

function RouteComponent() {
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [charge, setCharge] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  // Dummy products data
  const dummyProducts: Product[] = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      sku: "MED-PCM-500-SRP",
      units: "Strip",
      price: 2000,
    },
    {
      id: 2,
      name: "Paracetamol 500mg",
      sku: "MED-PCM-500-BOX",
      units: "Box",
      price: 10000,
    },
    {
      id: 3,
      name: "Ibuprofen 400mg",
      sku: "MED-IBU-400-SRP",
      units: "Strip",
      price: 2500,
    },
    {
      id: 4,
      name: "Ibuprofen 400mg",
      sku: "MED-IBU-400-BOX",
      units: "Box",
      price: 12000,
    },
    {
      id: 5,
      name: "Amoxicillin 500mg",
      sku: "MED-AMO-500-SRP",
      units: "Strip",
      price: 3000,
    },
    {
      id: 6,
      name: "Amoxicillin 500mg",
      sku: "MED-AMO-500-BOX",
      units: "Box",
      price: 15000,
    },
  ];

  // Filter products based on search
  const filteredProducts = dummyProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * item.price
            }
          : item
      ));
    } else {
      const newCartItem: CartItem = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        unit: product.units,
        price: product.price,
        quantity: 1,
        total: product.price
      };
      setCart([...cart, newCartItem]);
    }
  };

  const handleUpdateQuantity = (itemId: string, increment: boolean) => {
    setCart(cart.map(item =>
      item.id === itemId
        ? {
          ...item,
          quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1),
          total: increment ? (item.quantity + 1) * item.price : Math.max(1, item.quantity - 1) * item.price
        }
        : item
    ));
  };

  const handleRemoveItem = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal - discount + charge;

  const handleProcessPayment = () => {
    if (cart.length === 0) return;
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = (paymentDetails: PaymentDetails) => {
    // Create receipt
    const newReceipt: Receipt = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      discount,
      serviceCharge: charge,
      total,
      payment: paymentDetails
    };
    
    // Save receipt
    setReceipts([...receipts, newReceipt]);
    
    // Show success message
    if (paymentDetails.timing === 'immediate') {
      toast.success(`Payment of ${total.toLocaleString()} has been processed successfully.`);
    } else {
      toast.success(`Invoice ${newReceipt.id} has been created with due date ${paymentDetails.dueDate}.`);
    }
    
    // Reset cart and values
    setCart([]);
    setDiscount(0);
    setCharge(0);
    setShowPaymentDialog(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <Button
            variant="outline"
            className="w-full mb-4 text-left justify-start h-10"
            onClick={() => setShowProductDialog(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            Search products...
          </Button>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Product</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center w-[120px]">Qty</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Cart is empty. Search for products to add them to the cart.
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {dummyProducts.find(p => p.id === item.productId)?.sku}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-right font-mono">
                        {item.price.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(item.id, false)}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center tabular-nums">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(item.id, true)}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {item.total.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Calculation Section */}
        <div className="lg:col-span-4">
          <div className="rounded-md border p-4 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span>Subtotal</span>
              <span className="font-mono font-medium">{subtotal.toLocaleString()}</span>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Discount</label>
              <Input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0) {
                    setDiscount(value);
                  }
                }}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Service Charge</label>
              <Input
                type="number"
                min="0"
                value={charge}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0) {
                    setCharge(value);
                  }
                }}
                className="font-mono"
              />
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="font-mono">{total.toLocaleString()}</span>
            </div>

            <Button 
              className="w-full h-12 text-lg" 
              disabled={cart.length === 0}
              onClick={handleProcessPayment}
            >
              Process Payment
            </Button>
          </div>
        </div>
      </div>

      {/* Product Selection Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-3xl">
          <div className="flex items-center mb-4">
            <div>
              <h2 className="text-lg font-bold">Select Product</h2>
              <p className="text-sm text-muted-foreground">
                Search and select products to add to cart
              </p>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Product Info</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="relative">
                      <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search product by name or SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </TableCell>
                </TableRow>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-muted-foreground">{product.sku}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.units}</TableCell>
                    <TableCell className="font-mono">{product.price.toLocaleString()}</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Payment Dialog */}
      <PaymentComponent
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        totalAmount={total}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  )
}
