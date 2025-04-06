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
import { Trash2, Plus, AlertCircle, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Route = createFileRoute('/tenant/master-data/brand')({
  component: RouteComponent,
})

// Dummy data for the brands table
const dummyBrands = [
  { 
    id: 1, 
    name: "Apple", 
    code: "APPL",
    description: "Premium consumer electronics and computers",
    website: "https://www.apple.com",
    status: "active"
  },
  { 
    id: 2, 
    name: "Samsung", 
    code: "SMSNG",
    description: "Global electronics manufacturer",
    website: "https://www.samsung.com",
    status: "active"
  },
  { 
    id: 3, 
    name: "LG Electronics", 
    code: "LG",
    description: "Consumer electronics and appliances",
    website: "https://www.lg.com",
    status: "active"
  },
  { 
    id: 4, 
    name: "Sony", 
    code: "SNY",
    description: "Entertainment and electronics company",
    website: "https://www.sony.com",
    status: "active"
  },
  { 
    id: 5, 
    name: "Panasonic", 
    code: "PANA",
    description: "Japanese multinational electronics corporation",
    website: "https://www.panasonic.com",
    status: "inactive"
  },
];

function RouteComponent() {
  const [brands, setBrands] = useState(dummyBrands);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState({ 
    id: 0, 
    name: "", 
    code: "", 
    description: "", 
    website: "",
    status: "active" 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter brands based on search query
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    brand.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (brand.website && brand.website.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddBrand = () => {
    setIsEditing(false);
    setCurrentBrand({ 
      id: 0, 
      name: "", 
      code: "", 
      description: "", 
      website: "",
      status: "active" 
    });
    resetErrors();
    setIsDialogOpen(true);
  };

  const handleEditBrand = (brand: SetStateAction<{ 
    id: number; 
    name: string; 
    code: string; 
    description: string; 
    website: string;
    status: string 
  }>) => {
    setIsEditing(true);
    setCurrentBrand(brand);
    resetErrors();
    setIsDialogOpen(true);
  };

  const handleDeleteBrand = (id: number) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      setBrands(brands.filter(brand => brand.id !== id));
    }
  };

  const resetErrors = () => {
    setNameError("");
    setCodeError("");
    setWebsiteError("");
  };

  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError("Brand name is required");
      return false;
    }
    
    if (name.trim().length < 2) {
      setNameError("Brand name must be at least 2 characters");
      return false;
    }
    
    setNameError("");
    return true;
  };

  const validateCode = (code: string): boolean => {
    if (!code.trim()) {
      setCodeError("Brand code is required");
      return false;
    }
    
    if (!/^[A-Za-z0-9]+$/.test(code)) {
      setCodeError("Code must contain only letters and numbers");
      return false;
    }
    
    setCodeError("");
    return true;
  };

  const validateWebsite = (website: string): boolean => {
    if (!website) {
      return true; // Website is optional
    }
    
    try {
      new URL(website);
      setWebsiteError("");
      return true;
    } catch (e) {
      setWebsiteError("Please enter a valid URL (e.g., https://example.com)");
      return false;
    }
  };

  const handleSaveBrand = () => {
    const isNameValid = validateName(currentBrand.name);
    const isCodeValid = validateCode(currentBrand.code);
    const isWebsiteValid = validateWebsite(currentBrand.website);
    
    if (!isNameValid || !isCodeValid || !isWebsiteValid) {
      return;
    }

    if (isEditing) {
      setBrands(brands.map(brand => brand.id === currentBrand.id ? currentBrand : brand));
    } else {
      const newId = brands.length > 0 ? Math.max(...brands.map(brand => brand.id)) + 1 : 1;
      setBrands([...brands, { ...currentBrand, id: newId }]);
    }
    
    setIsDialogOpen(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCurrentBrand({ ...currentBrand, name: newName });
    
    // Clear error when user starts typing again
    if (nameError) {
      setNameError("");
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value;
    setCurrentBrand({ ...currentBrand, code: newCode });
    
    // Clear error when user starts typing again
    if (codeError) {
      setCodeError("");
    }
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWebsite = e.target.value;
    setCurrentBrand({ ...currentBrand, website: newWebsite });
    
    // Clear error when user starts typing again
    if (websiteError) {
      setWebsiteError("");
    }
  };



  const openWebsite = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Brands Management</h1>
        <div className="flex justify-between items-center gap-2">
          <Input 
            type="text" 
            placeholder="Search brands..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full"
          />
          <Button onClick={handleAddBrand} className="flex items-center gap-1 whitespace-nowrap">
            <Plus size={18} /> 
            <span className="hidden sm:inline">Add New Brand</span>
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="hidden md:table-cell">Website</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                    <p>No brands found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBrands.map((brand, index) => (
              <TableRow key={brand.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="font-medium">{brand.name}</div>
                      <div className="text-xs text-gray-500">Code: {brand.code}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-xs truncate" title={brand.description}>
                  {brand.description || "No description"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {brand.website ? (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-blue-600" 
                      onClick={() => openWebsite(brand.website)}
                    >
                      {new URL(brand.website).hostname}
                    </Button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    brand.status === "active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {brand.status.charAt(0).toUpperCase() + brand.status.slice(1)}
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
                        onClick={() => handleEditBrand(brand)}
                        className="cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
                        Edit
                      </DropdownMenuItem>
                      {brand.website && (
                        <DropdownMenuItem 
                          onClick={() => openWebsite(brand.website)}
                          className="cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                          Visit Website
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="cursor-pointer text-red-600"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Brand" : "Add New Brand"}</DialogTitle>
            <DialogDescription>
              Please fill in all required fields marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center">
                Brand Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                value={currentBrand.name}
                onChange={handleNameChange}
                className={`w-full transition-colors ${nameError ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="Brand name"
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
                Brand Code <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="code"
                value={currentBrand.code}
                onChange={handleCodeChange}
                className={`w-full transition-colors ${codeError ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="e.g., APPL, SMSNG"
              />
              {codeError && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠️</span> {codeError}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="website">
                Website URL <span className="text-xs text-gray-500 ml-2">(optional)</span>
              </Label>
              <Input
                id="website"
                type="url"
                value={currentBrand.website}
                onChange={handleWebsiteChange}
                className={`w-full transition-colors ${websiteError ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="https://example.com"
              />
              {websiteError && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠️</span> {websiteError}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">
                Description <span className="text-xs text-gray-500 ml-2">(optional)</span>
              </Label>
              <Input
                id="description"
                value={currentBrand.description}
                onChange={(e) => setCurrentBrand({ ...currentBrand, description: e.target.value })}
                className="w-full"
                placeholder="Brief description of the brand"
              />
            </div>
            
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={currentBrand.status}
                onValueChange={(value) => setCurrentBrand({ ...currentBrand, status: value })}
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
            <Button onClick={handleSaveBrand} className="min-w-[80px]">
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
