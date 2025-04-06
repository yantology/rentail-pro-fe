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
import { Pencil, Trash2, Plus, AlertCircle, MoreVertical, CheckCircle, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Route = createFileRoute('/tenant/master-data/categories')({
  component: RouteComponent,
})

// Dummy data for the categories table
const dummyCategories = [
  { id: 1, name: "Electronics", code: "ELEC", description: "Electronic devices and accessories", status: "active" },
  { id: 2, name: "Furniture", code: "FURN", description: "Home and office furniture", status: "active" },
  { id: 3, name: "Clothing", code: "CLTH", description: "Apparel and fashion items", status: "inactive" },
  { id: 4, name: "Books", code: "BOOK", description: "Books and publications", status: "active" },
  { id: 5, name: "Sports", code: "SPRT", description: "Sports equipment and gear", status: "inactive" },
];

function RouteComponent() {
  const [categories, setCategories] = useState(dummyCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: 0, name: "", code: "", description: "", status: "active" });
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    category.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = () => {
    setIsEditing(false);
    setCurrentCategory({ id: 0, name: "", code: "", description: "", status: "active" });
    setNameError("");
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: SetStateAction<{ id: number; name: string; code: string; description: string; status: string }>) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setNameError("");
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter(category => category.id !== id));
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
    
    // Check if name already exists (for new categories)
    if (!isEditing && categories.some(category => category.name.toLowerCase() === name.toLowerCase())) {
      setNameError("This category name already exists");
      return false;
    }
    
    // Check if name already exists (for edited categories, excluding the current one)
    if (isEditing && categories.some(category => category.id !== currentCategory.id && category.name.toLowerCase() === name.toLowerCase())) {
      setNameError("This category name already exists");
      return false;
    }
    
    setNameError("");
    return true;
  };

  const handleSaveCategory = () => {
    const isNameValid = validateName(currentCategory.name);
    
    if (!isNameValid) {
      return;
    }

    if (!currentCategory.code) {
      alert("Category code is required!");
      return;
    }

    if (currentCategory.code.length > 4) {
      alert("Category code must not exceed 4 characters!");
      return;
    }

    if (isEditing) {
      setCategories(categories.map(category => category.id === currentCategory.id ? currentCategory : category));
    } else {
      const newId = Math.max(...categories.map(category => category.id)) + 1;
      setCategories([...categories, { ...currentCategory, id: newId }]);
    }
    
    setIsDialogOpen(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCurrentCategory({ ...currentCategory, name: newName });
    
    // Clear error when user starts typing again
    if (nameError) {
      setNameError("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Categories Management</h1>
        <div className="flex justify-between items-center gap-2">
          <Input 
            type="text" 
            placeholder="Search by name, code, or description..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full"
          />
          <Button onClick={handleAddCategory} className="flex items-center gap-1 whitespace-nowrap">
            <Plus size={18} /> 
            <span className="hidden sm:inline">Add New Category</span>
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Code</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="text-center hidden md:table-cell">Status</TableHead>
              <TableHead className="text-center md:hidden w-10">St</TableHead>
              <TableHead className="text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                    <p>No categories found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCategories.map((category, index) => (
              <TableRow key={category.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-center font-mono">{category.code}</TableCell>
                <TableCell className="hidden md:table-cell truncate max-w-xs" title={category.description}>
                  {category.description}
                </TableCell>
                {/* Status column for desktop */}
                <TableCell className="text-center hidden md:table-cell">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                    category.status === "active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      category.status === "active" ? "bg-green-600" : "bg-red-600"
                    }`}></span>
                    {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                  </span>
                </TableCell>
                {/* Status icon only for mobile */}
                <TableCell className="text-center md:hidden">
                  {category.status === "active" 
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
                      onClick={() => handleEditCategory(category)} 
                      className="h-8 w-8 p-0"
                      title="Edit category"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50" 
                      onClick={() => handleDeleteCategory(category.id)}
                      title="Delete category"
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
                          onClick={() => handleEditCategory(category)}
                          className="cursor-pointer"
                        >
                          <Pencil size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCategory(category.id)}
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
            <DialogTitle>{isEditing ? "Edit Category" : "Add New Category"}</DialogTitle>
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
                value={currentCategory.name}
                onChange={handleNameChange}
                className={`w-full transition-colors ${nameError ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="e.g., Electronics, Furniture, Clothing"
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
              <Label htmlFor="code" className="flex items-center">
                Category Code <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-gray-500 ml-2">(max 4 characters)</span>
              </Label>
              <Input
                id="code"
                value={currentCategory.code}
                onChange={(e) => setCurrentCategory({ ...currentCategory, code: e.target.value.toUpperCase() })}
                className="w-full"
                placeholder="e.g., ELEC, FURN, CLTH"
                maxLength={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">
                Description 
                <span className="text-xs text-gray-500 ml-2">(optional)</span>
              </Label>
              <Input
                id="description"
                value={currentCategory.description}
                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                className="w-full"
                placeholder="Brief description of the category"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={currentCategory.status}
                onValueChange={(value) => setCurrentCategory({ ...currentCategory, status: value })}
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
            <Button onClick={handleSaveCategory} className="min-w-[80px]">
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
