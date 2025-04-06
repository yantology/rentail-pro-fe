import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";

interface GeneralInformationProps {
  onChange?: (field: string, value: string) => void;
  formData?: {
    name?: string;
    sku?: string;
    barcode?: string;
    description?: string;
    brand?: string;
    category?: string;
  };
}

export function GeneralInformation({ onChange, formData = {} }: GeneralInformationProps) {
  const handleChange = (field: string, value: string) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Enter the basic information about the product
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input 
              id="product-name" 
              placeholder="Enter product name" 
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input 
              id="sku" 
              placeholder="Enter SKU" 
              value={formData.sku || ''}
              onChange={(e) => handleChange('sku', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input 
              id="barcode" 
              placeholder="Enter barcode" 
              value={formData.barcode || ''}
              onChange={(e) => handleChange('barcode', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select 
              value={formData.brand || ''} 
              onValueChange={(value) => handleChange('brand', value)}
            >
              <SelectTrigger id="brand">
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand1">Brand 1</SelectItem>
                <SelectItem value="brand2">Brand 2</SelectItem>
                <SelectItem value="brand3">Brand 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formData.category || ''} 
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category1">Category 1</SelectItem>
              <SelectItem value="category2">Category 2</SelectItem>
              <SelectItem value="category3">Category 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="Enter product description" 
            className="min-h-[120px]"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}