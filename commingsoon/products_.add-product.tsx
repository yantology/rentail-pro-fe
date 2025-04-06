import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralInformation } from '@/components/custom/add-product/general-information'
import { UnitAndCoveration } from '@/components/custom/add-product/unit-and-coveration'

export const Route = createFileRoute('/tenant/master-data/products_/add-product')({
  component: RouteComponent,
})

interface PriceTier {
  id: string;
  type: 'minimum' | 'customer-category' | 'wholesale' | 'combined';
  minimumQty?: number;
  customerCategory?: string;
  price: number;
}

interface UnitConversion {
  id: string;
  unit: string;
  conversionFactor: number;
  conversionDirection: 'to-main' | 'from-main'; // 'to-main': X unit = 1 main, 'from-main': 1 main = X unit
  canBuy: boolean;
  basePrice?: number;
  priceTiers?: PriceTier[];
}

interface ProductFormData {
  // General Information
  name?: string;
  sku?: string;
  barcode?: string;
  description?: string;
  brand?: string;
  category?: string;
  
  // Unit and Conversion
  mainUnit?: string;
  mainUnitPrice?: number;
  mainUnitPriceTiers?: PriceTier[];
  unitConversions?: UnitConversion[];
}

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("general")
  const [formData, setFormData] = useState<ProductFormData>({
    mainUnitPriceTiers: [],
    unitConversions: []
  })

  const handleGeneralInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUnitChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    console.log('Submitting form data:', formData)
    // Here you would handle the form submission, e.g. sending to API
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>Save Product</Button>
        </div>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="units">Unit & Conversion</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-6">
          <GeneralInformation onChange={handleGeneralInfoChange} formData={formData} />
        </TabsContent>
        <TabsContent value="units" className="mt-6">
          <UnitAndCoveration onChange={handleUnitChange} formData={formData} />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 mt-8">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit}>Save Product</Button>
      </div>
    </div>
  )
}
