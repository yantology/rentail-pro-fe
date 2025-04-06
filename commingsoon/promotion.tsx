import { AlertCircle, MoreVertical, Pencil, Plus, Trash2, Calendar } from "lucide-react"
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Interface definitions
interface Product {
  id: number
  name: string
  sku: string
  price: number
  unit: string
}

interface Promotion {
  id: number
  productId: number
  unit: string
  discountType: 'fixed' | 'percentage'
  value: number
  startDate: string
  endDate: string
  status: 'active' | 'inactive'
}

// Dummy data for products
const dummyProducts: Product[] = [
  { id: 1, name: "Product A", sku: "PA001", price: 100000, unit: "Box" },
  { id: 2, name: "Product B", sku: "PB002", price: 250000, unit: "Unit" },
  { id: 3, name: "Product C", sku: "PC003", price: 75000, unit: "Pack" },
]

// Dummy data for promotions
const dummyPromotions: Promotion[] = [
  {
    id: 1,
    productId: 1,
    unit: "Box",
    discountType: 'percentage',
    value: 10,
    startDate: '2025-03-29',
    endDate: '2025-04-29',
    status: 'active'
  },
  {
    id: 2,
    productId: 2,
    unit: "Unit",
    discountType: 'fixed',
    value: 50000,
    startDate: '2025-04-01',
    endDate: '2025-05-01',
    status: 'active'
  }
]

export const Route = createFileRoute('/tenant/master-data/promotion')({
  component: RouteComponent,
})

function RouteComponent() {
  const [promotions, setPromotions] = useState(dummyPromotions)
  const [products] = useState(dummyProducts)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [currentPromotion, setCurrentPromotion] = useState<Promotion>({
    id: 0,
    productId: 0,
    unit: "",
    discountType: 'percentage',
    value: 0,
    startDate: '',
    endDate: '',
    status: 'active'
  })

  // Filter promotions based on search query
  const filteredPromotions = promotions.filter(promotion => {
    const product = products.find(p => p.id === promotion.productId)
    return (
      product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleAddPromotion = () => {
    setIsEditing(false)
    setCurrentPromotion({
      id: 0,
      productId: 0,
      unit: "",
      discountType: 'percentage',
      value: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active'
    })
    setIsDialogOpen(true)
  }

  const handleEditPromotion = (promotion: Promotion) => {
    setIsEditing(true)
    setCurrentPromotion(promotion)
    setIsDialogOpen(true)
  }

  const handleDeletePromotion = (id: number) => {
    if (confirm("Are you sure you want to delete this promotion?")) {
      setPromotions(promotions.filter(promotion => promotion.id !== id))
    }
  }

  const handleSavePromotion = () => {
    // Validate inputs
    if (!currentPromotion.productId) {
      alert("Please select a product")
      return
    }

    if (!currentPromotion.unit) {
      alert("Please select a unit")
      return
    }

    if (currentPromotion.value <= 0) {
      alert("Please enter a valid promotion value")
      return
    }

    // Check for overlapping promotions
    const hasOverlap = promotions.some(promo => 
      promo.id !== currentPromotion.id &&
      promo.productId === currentPromotion.productId &&
      promo.status === 'active' &&
      new Date(promo.startDate) <= new Date(currentPromotion.endDate) &&
      new Date(promo.endDate) >= new Date(currentPromotion.startDate)
    )

    if (hasOverlap) {
      alert("This product already has an active promotion during the selected period")
      return
    }

    if (isEditing) {
      setPromotions(promotions.map(promo => 
        promo.id === currentPromotion.id ? currentPromotion : promo
      ))
    } else {
      const newId = Math.max(...promotions.map(p => p.id), 0) + 1
      setPromotions([...promotions, { ...currentPromotion, id: newId }])
    }

    setIsDialogOpen(false)
  }

  const calculateDiscountedPrice = (product: Product, promotion: Promotion): number => {
    if (promotion.discountType === 'percentage') {
      return product.price * (1 - promotion.value / 100)
    } else {
      return product.price - promotion.value
    }
  }

  const getProduct = (productId: number): Product | undefined => {
    return products.find(p => p.id === productId)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Promotion Management</h1>
        <div className="flex justify-between items-center gap-2">
          <Input 
            type="text"
            placeholder="Search promotions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleAddPromotion} className="flex items-center gap-1 whitespace-nowrap">
            <Plus size={18} />
            <span className="hidden sm:inline">Add New Promotion</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromotions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-32 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                    <p>No promotions found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPromotions.map((promotion, index) => {
                const product = getProduct(promotion.productId)
                const discountedPrice = product ? calculateDiscountedPrice(product, promotion) : 0

                return (
                  <TableRow key={promotion.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <TableCell className="text-center font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{product?.name}</span>
                        <span className="text-xs text-gray-500">{product?.sku}</span>
                      </div>
                    </TableCell>
                    <TableCell>{promotion.unit}</TableCell>
                    <TableCell>
                      {promotion.discountType === 'percentage' ? (
                        <span>{promotion.value}%</span>
                      ) : (
                        <span>Rp {promotion.value.toLocaleString()}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm line-through text-gray-500">Rp {product?.price.toLocaleString()}</span>
                        <span className="font-medium text-green-600">Rp {discountedPrice.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        promotion.status === 'active'
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right p-0 pr-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditPromotion(promotion)}
                            className="cursor-pointer"
                          >
                            <Pencil size={16} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePromotion(promotion.id)}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Promotion" : "Add New Promotion"}</DialogTitle>
            <DialogDescription>
              Please fill in all required fields marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product">Product <span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={currentPromotion.productId.toString()}
                onValueChange={(value) => setCurrentPromotion({
                  ...currentPromotion,
                  productId: parseInt(value),
                  unit: getProduct(parseInt(value))?.unit || ""
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="unit">Unit <span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="unit"
                value={currentPromotion.unit}
                disabled
                className="w-full bg-gray-100"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discountType">Discount Type <span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={currentPromotion.discountType}
                onValueChange={(value: 'percentage' | 'fixed') => setCurrentPromotion({
                  ...currentPromotion,
                  discountType: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (Rp)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="value">
                Value <span className="text-red-500 ml-1">*</span>
                {currentPromotion.discountType === 'percentage' && (
                  <span className="text-xs text-gray-500 ml-2">(1-100)</span>
                )}
              </Label>
              <Input
                id="value"
                type="number"
                value={currentPromotion.value}
                onChange={(e) => setCurrentPromotion({
                  ...currentPromotion,
                  value: parseFloat(e.target.value)
                })}
                min={0}
                max={currentPromotion.discountType === 'percentage' ? 100 : undefined}
                className="w-full"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date <span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="startDate"
                type="date"
                value={currentPromotion.startDate}
                onChange={(e) => setCurrentPromotion({
                  ...currentPromotion,
                  startDate: e.target.value
                })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date <span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="endDate"
                type="date"
                value={currentPromotion.endDate}
                onChange={(e) => setCurrentPromotion({
                  ...currentPromotion,
                  endDate: e.target.value
                })}
                min={currentPromotion.startDate}
                className="w-full"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={currentPromotion.status}
                onValueChange={(value: 'active' | 'inactive') => setCurrentPromotion({
                  ...currentPromotion,
                  status: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Active
                    </span>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                      Inactive
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePromotion} className="min-w-[80px]">
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
