import { createFileRoute } from '@tanstack/react-router'
import { useState, type SetStateAction } from 'react'
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
// Import icons for better UI
import { Pencil, Trash2, Plus, AlertCircle, MoreVertical, CheckCircle, XCircle } from "lucide-react"
// Import dropdown menu for mobile actions
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Route = createFileRoute('/tenant/master-data/unit')({
  component: RouteComponent,
})

// Dummy data for the units table
const dummyUnits = [
  { id: 1, name: "Box", skuCode: "BOX", status: "active" },
  { id: 2, name: "Carton", skuCode: "CTN", status: "active" },
  { id: 3, name: "Piece", skuCode: "PCS", status: "inactive" },
  { id: 4, name: "Kilogram", skuCode: "KG", status: "active" },
  { id: 5, name: "Liter", skuCode: "LTR", status: "inactive" },
];

function RouteComponent() {
  const [units, setUnits] = useState(dummyUnits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState({ id: 0, name: "", skuCode: "", status: "active" });
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter units based on search query
  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    unit.skuCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUnit = () => {
    setIsEditing(false);
    setCurrentUnit({ id: 0, name: "", skuCode: "", status: "active" });
    setNameError("");
    setIsDialogOpen(true);
  };

  const handleEditUnit = (unit: SetStateAction<{ id: number; name: string; skuCode: string; status: string }>) => {
    setIsEditing(true);
    setCurrentUnit(unit);
    setNameError("");
    setIsDialogOpen(true);
  };

  const handleDeleteUnit = (id: number) => {
    if (confirm("Are you sure you want to delete this unit?")) {
      setUnits(units.filter(unit => unit.id !== id));
    }
  };

  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    }
    
    if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    
    if (name.trim().length > 50) {
      setNameError("Name must be less than 50 characters");
      return false;
    }
    
    // Check if name already exists (for new units)
    if (!isEditing && units.some(unit => unit.name.toLowerCase() === name.toLowerCase())) {
      setNameError("This unit name already exists");
      return false;
    }
    
    // Check if name already exists (for edited units, excluding the current one)
    if (isEditing && units.some(unit => unit.id !== currentUnit.id && unit.name.toLowerCase() === name.toLowerCase())) {
      setNameError("This unit name already exists");
      return false;
    }
    
    setNameError("");
    return true;
  };

  const handleSaveUnit = () => {
    const isNameValid = validateName(currentUnit.name);
    
    if (!isNameValid) {
      return;
    }

    if (!currentUnit.skuCode) {
      alert("SKU Code is required!");
      return;
    }

    if (currentUnit.skuCode.length > 4) {
      alert("SKU Code must not exceed 4 characters!");
      return;
    }

    if (isEditing) {
      setUnits(units.map(unit => unit.id === currentUnit.id ? currentUnit : unit));
    } else {
      const newId = Math.max(...units.map(unit => unit.id)) + 1;
      setUnits([...units, { ...currentUnit, id: newId }]);
    }
    
    setIsDialogOpen(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCurrentUnit({ ...currentUnit, name: newName });
    
    // Clear error when user starts typing again
    if (nameError) {
      setNameError("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Units Management</h1>
        <div className="flex justify-between items-center gap-2">
          <Input 
            type="text" 
            placeholder="Search by name or SKU code..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full"
          />
          <Button onClick={handleAddUnit} className="flex items-center gap-1 whitespace-nowrap">
            <Plus size={18} /> 
            <span className="hidden sm:inline">Add New Unit</span>
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">SKU Code</TableHead>
              <TableHead className="text-center hidden md:table-cell">Status</TableHead>
              <TableHead className="text-center md:hidden w-10">St</TableHead>
              <TableHead className="text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                    <p>No units found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUnits.map((unit, index) => (
              <TableRow key={unit.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{unit.name}</TableCell>
                <TableCell className="text-center font-mono">{unit.skuCode}</TableCell>
                {/* Status column for desktop */}
                <TableCell className="text-center hidden md:table-cell">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                    unit.status === "active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      unit.status === "active" ? "bg-green-600" : "bg-red-600"
                    }`}></span>
                    {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                  </span>
                </TableCell>
                {/* Status icon only for mobile */}
                <TableCell className="text-center md:hidden">
                  {unit.status === "active" 
                    ? <CheckCircle size={18} className="text-green-600 inline" /> 
                    : <XCircle size={18} className="text-red-600 inline" />
                  }
                </TableCell>
                <TableCell className="text-right p-0 pr-2">
                  {/* Desktop actions */}
                  <div className="hidden md:flex space-x-1 justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditUnit(unit)} 
                      className="h-8 w-8 p-0"
                      title="Edit unit"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50" 
                      onClick={() => handleDeleteUnit(unit.id)}
                      title="Delete unit"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  {/* Mobile dropdown menu for actions */}
                  <div className="md:hidden">
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
                          onClick={() => handleEditUnit(unit)}
                          className="cursor-pointer"
                        >
                          <Pencil size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUnit(unit.id)}
                          className="cursor-pointer text-red-600"
                          variant="destructive"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Unit" : "Add New Unit"}</DialogTitle>
        <DialogDescription>
          Please fill in all required fields marked with an asterisk (*).
        </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name" className="flex items-center">
            Name <span className="text-red-500 ml-1">*</span>
            <span className="text-xs text-gray-500 ml-2">(2-50 characters)</span>
          </Label>
          <Input
            id="name"
            value={currentUnit.name}
            onChange={handleNameChange}
            className={`w-full transition-colors ${nameError ? "border-red-500 focus:border-red-500" : ""}`}
            placeholder="e.g., Kilogram, Box, Piece"
            maxLength={50}
            autoFocus
          />
          {nameError && (
            <p className="text-red-500 text-xs flex items-center">
          <span className="mr-1">⚠️</span> {nameError}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="skuCode" className="flex items-center">
            SKU Code <span className="text-red-500 ml-1">*</span>
            <span className="text-xs text-gray-500 ml-2">(max 4 characters)</span>
          </Label>
          <Input
            id="skuCode"
            value={currentUnit.skuCode}
            onChange={(e) => setCurrentUnit({ ...currentUnit, skuCode: e.target.value.toUpperCase() })}
            className="w-full"
            placeholder="e.g., KG, BOX, PCS"
            maxLength={4}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={currentUnit.status}
            onValueChange={(value) => setCurrentUnit({ ...currentUnit, status: value })}
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
        <Button onClick={handleSaveUnit} className="min-w-[80px]">
          {isEditing ? "Update" : "Create"}
        </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
