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
  SelectValue, 
} from "@/components/ui/select"
import { Pencil, Trash2, Plus, AlertCircle, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Route = createFileRoute('/tenant/master-data/warehouse-and-rack')({
  component: RouteComponent,
})

// Dummy data for storage units
const dummyStorageUnits = [
  { 
    id: 1, 
    name: "Main Warehouse", 
    type: "warehouse",
    status: "active"
  },
  { 
    id: 2, 
    name: "Rack A1", 
    type: "rack",
    status: "active"
  },
  { 
    id: 3, 
    name: "Rack B1", 
    type: "rack",
    status: "active"
  },
];

function RouteComponent() {
  const [storageUnits, setStorageUnits] = useState(dummyStorageUnits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<{
    id: number;
    name: string;
    type: string;
    status: string;
  }>({  // Explicitly define the type here
    id: 0,
    name: "",
    type: "warehouse",
    status: "active"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUnits = storageUnits.filter(unit =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUnit = () => {
    setIsEditing(false);
    setCurrentUnit({
      id: 0,
      name: "",
      type: "warehouse",
      status: "active"
    });
    setNameError("");
    setIsDialogOpen(true);
  };

  const handleEditUnit = (unit: SetStateAction<{
    id: number;
    name: string;
    type: string;
    status: string;
  }>) => {
    setIsEditing(true);
    setCurrentUnit(unit);
    setNameError("");
    setIsDialogOpen(true);
  };

  const handleDeleteUnit = (id: number) => {
    if (confirm("Are you sure you want to delete this storage unit?")) {
      setStorageUnits(storageUnits.filter(unit => unit.id !== id));
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

    setNameError("");
    return true;
  };

  const handleSaveUnit = () => {
    const isValid = validateName(currentUnit.name);
    
    if (!isValid) {
      alert("Please fill all required fields!");
      return;
    }

    if (isEditing) {
      setStorageUnits(storageUnits.map(unit => unit.id === currentUnit.id ? currentUnit : unit));
    } else {
      const newId = Math.max(...storageUnits.map(unit => unit.id)) + 1;
      setStorageUnits([...storageUnits, { ...currentUnit, id: newId }]);
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Storage Units Management</h1>
        <div className="flex justify-between items-center gap-2">
          <Input
            type="text"
            placeholder="Search by name or type..."
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
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                    <p>No storage units found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUnits.map((unit, index) => (
              <TableRow key={unit.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell>{unit.name}</TableCell>
                <TableCell className="text-center capitalize">{unit.type}</TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 rounded ${unit.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {unit.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditUnit(unit)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteUnit(unit.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Storage Unit" : "Add New Storage Unit"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update storage unit details below"
                : "Fill in the details for the new storage unit"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentUnit.name}
                onChange={(e) => {
                  setCurrentUnit({...currentUnit, name: e.target.value});
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
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={currentUnit.type}
                onValueChange={(value) => setCurrentUnit({...currentUnit, type: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="rack">Rack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={currentUnit.status}
                onValueChange={(value) => setCurrentUnit({...currentUnit, status: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleSaveUnit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
