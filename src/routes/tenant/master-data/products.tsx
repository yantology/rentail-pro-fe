import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Pencil, Trash2, MoreVertical } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Route = createFileRoute('/tenant/master-data/products')({
  component: RouteComponent,
})

// Product type definition
type Product = {
  id: number;
  name: string;
  price: number;
}

function RouteComponent() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Laptop Asus ROG", price: 15000000 },
    { id: 2, name: "Mouse Wireless Logitech", price: 350000 },
    { id: 3, name: "Keyboard Mechanical", price: 750000 },
    { id: 4, name: "Monitor LG 24 inch", price: 2100000 },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>({ id: 0, name: "", price: 0 });
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  // Format price in Rupiah
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddProduct = () => {
    setCurrentProduct({ id: Date.now(), name: "", price: 0 });
    setNameError("");
    setPriceError("");
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct({...product});
    setNameError("");
    setPriceError("");
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleSaveProduct = () => {
    // Validation
    let isValid = true;
    
    if (!currentProduct.name.trim()) {
      setNameError("Product name is required");
      isValid = false;
    }
    
    if (currentProduct.price <= 0) {
      setPriceError("Price must be greater than 0");
      isValid = false;
    }
    
    if (!isValid) return;
    
    if (isEditing) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === currentProduct.id ? currentProduct : product
      ));
    } else {
      // Add new product
      setProducts([...products, currentProduct]);
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={handleAddProduct} className="flex items-center gap-1">
          <Plus size={18} />
          <span>Add Product</span>
        </Button>
      </div>
      
      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-32 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p>No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-right">{formatRupiah(product.price)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update product details below" 
                : "Fill in the details for the new product"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentProduct.name}
                onChange={(e) => {
                  setCurrentProduct({...currentProduct, name: e.target.value});
                  if (nameError) setNameError("");
                }}
                className="col-span-3"
              />
              {nameError && (
                <p className="col-span-4 text-right text-sm text-red-500">
                  {nameError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (Rp)
              </Label>
              <Input
                id="price"
                type="number"
                value={currentProduct.price}
                onChange={(e) => {
                  setCurrentProduct({...currentProduct, price: Number(e.target.value)});
                  if (priceError) setPriceError("");
                }}
                className="col-span-3"
              />
              {priceError && (
                <p className="col-span-4 text-right text-sm text-red-500">
                  {priceError}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleSaveProduct}>
              {isEditing ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
