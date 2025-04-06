import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { Trash } from "lucide-react";
import { Separator } from "../../ui/separator";
import { Collapsible, CollapsibleTrigger } from "../../ui/collapsible";

interface ProductFormData {
  name?: string;
  sku?: string;
  barcode?: string;
  description?: string;
  brand?: string;
  category?: string;
  mainUnit?: string;
  unitConversions?: UnitConversion[];
}

interface UnitConversion {
  id: string;
  unit: string;
  conversionFactor: number;
  conversionDirection: 'to-main' | 'from-main';
  canBuy: boolean;
}

interface UnitAndCoverationProps {
  onChange: (field: string, value: any) => void;
  formData: ProductFormData;
}

export function UnitAndCoveration({ onChange, formData }: UnitAndCoverationProps) {
  const unitOptions = [
    { value: 'strip', label: 'Strip' },
    { value: 'pcs', label: 'Pieces' },
    { value: 'box', label: 'Box' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'g', label: 'Gram' },
    { value: 'l', label: 'Liter' },
    { value: 'ml', label: 'Milliliter' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Units</CardTitle>
        <CardDescription>
          Define units of measurement and their conversions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Unit Selection */}
        <div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="main-unit" className="text-lg font-semibold">Main Unit</Label>
            </div>
            <Select
              value={formData.mainUnit}
              onValueChange={(value) => onChange('mainUnit', value)}
            >
              <SelectTrigger id="main-unit">
                <SelectValue placeholder="Select main unit" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map(unit => (
                  <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Select the smallest unit you sell (e.g. if you sell medicine by strips, choose 'Strip')
            </p>
          </div>
        </div>

        <Separator />

        {/* Additional Units */}
        <div>
          <h3 className="text-lg font-medium mb-4">Additional Units & Conversions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-1">
              <Label htmlFor="conversion-unit">Unit</Label>
              <Select>
                <SelectTrigger id="conversion-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map(unit => (
                    <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <Label>Conversion Formula</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="number"
                  min={0.001}
                  step={0.001}
                  className="w-24"
                />
                <span>unit</span>
                <span>=</span>
                <Input 
                  type="number"
                  min={0.001}
                  step={0.001}
                  className="w-24"
                />
                <span>main unit</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter the conversion ratio between units (e.g. 1 box = 10 pieces)
              </p>
            </div>
            
            <div className="flex items-end space-x-2">
              <div className="flex items-center space-x-2">
                <Switch id="can-buy" />
                <Label htmlFor="can-buy">Can buy</Label>
              </div>
              <Button>Add</Button>
            </div>
          </div>

          {/* Example conversion */}
          <div className="space-y-2">
            <Collapsible className="border rounded-md overflow-hidden">
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="font-medium">Box</div>
                  <div className="text-sm">1 Box = 10 pcs</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Buyable
                  </span>
                  <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}