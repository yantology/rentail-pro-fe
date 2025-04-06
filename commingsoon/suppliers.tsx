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
import { Trash2, Plus, AlertCircle, MoreVertical, Phone, Mail, MapPin, MessageSquare, Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const Route = createFileRoute('/tenant/master-data/suppliers')({
  component: RouteComponent,
})

// Dummy data for the supplier categories
const dummySupplierCategories = [
  { id: 1, name: "General", code: "GEN" },
  { id: 2, name: "Primary", code: "PRIM" },
  { id: 3, name: "Distributor", code: "DIST" },
  { id: 4, name: "Manufacturer", code: "MANF" },
  { id: 5, name: "International", code: "INTL" },
];

// Dummy data for the suppliers table
const dummySuppliers = [
  { 
    id: 1, 
    name: "Tech Components Ltd", 
    contactPerson: "Robert Chen",
    email: "robert@techcomponents.com",
    phone: "081234567890",
    address: "789 Industry Blvd, San Jose, CA 95123",
    website: "https://techcomponents.com",
    categoryId: 2,
    status: "active"
  },
  { 
    id: 2, 
    name: "Global Distribution Inc", 
    contactPerson: "Sarah Johnson",
    email: "sjohnson@globaldist.com",
    phone: "089876543210",
    address: "456 Commerce Way, Chicago, IL 60603",
    website: "https://globaldist.com",
    categoryId: 3,
    status: "active"
  },
  { 
    id: 3, 
    name: "Eastern Manufacturers", 
    contactPerson: "Li Wei",
    email: "li.wei@easternmfg.com",
    phone: "087654321098",
    address: "123 Export Zone, Shanghai, 200120",
    website: "https://easternmfg.com",
    categoryId: 4,
    status: "inactive"
  },
  { 
    id: 4, 
    name: "Office Supplies Direct", 
    contactPerson: "Michael Brown",
    email: "michael@officesupplies.com",
    phone: "085432109876",
    address: "321 Business Park, Dallas, TX 75001",
    website: "",
    categoryId: 1,
    status: "active"
  },
  { 
    id: 5, 
    name: "Overseas Imports Co", 
    contactPerson: "Javier Mendez",
    email: "jmendez@overseasimports.com",
    phone: "082345678901",
    address: "567 Harbor Dr, Miami, FL 33101",
    website: "https://overseasimports.com",
    categoryId: 5,
    status: "active"
  },
];

function RouteComponent() {
  const [suppliers, setSuppliers] = useState(dummySuppliers);
  const [categories] = useState(dummySupplierCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({ 
    id: 0, 
    name: "", 
    contactPerson: "",
    email: "", 
    phone: "", 
    address: "", 
    website: "",
    categoryId: 1, 
    status: "active" 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) || 
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.phone.includes(searchQuery) ||
    supplier.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCategoryName(supplier.categoryId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSupplier = () => {
    setIsEditing(false);
    setCurrentSupplier({ 
      id: 0, 
      name: "", 
      contactPerson: "",
      email: "", 
      phone: "", 
      address: "", 
      website: "",
      categoryId: 1, 
      status: "active" 
    });
    resetErrors();
    setIsDialogOpen(true);
  };

  const handleEditSupplier = (supplier: SetStateAction<{ 
    id: number; 
    name: string; 
    contactPerson: string;
    email: string; 
    phone: string; 
    address: string; 
    website: string;
    categoryId: number; 
    status: string 
  }>) => {
    setIsEditing(true);
    setCurrentSupplier(supplier);
    resetErrors();
    setIsDialogOpen(true);
  };

  const handleDeleteSupplier = (id: number) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    }
  };

  const resetErrors = () => {
    setNameError("");
    setEmailError("");
    setPhoneError("");
    setWebsiteError("");
  };

  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError("Company name is required");
      return false;
    }
    
    if (name.trim().length < 2) {
      setNameError("Company name must be at least 2 characters");
      return false;
    }
    
    if (name.trim().length > 100) {
      setNameError("Company name must be less than 100 characters");
      return false;
    }
    
    setNameError("");
    return true;
  };

  const validateEmail = (email: string): boolean => {
    if (email && !isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      return false;
    }
    
    if (phone.trim().length < 10) {
      setPhoneError("Phone number must be at least 10 digits");
      return false;
    }
    
    if (phone.trim().length > 15) {
      setPhoneError("Phone number must be less than 15 digits");
      return false;
    }
    
    if (!isValidPhone(phone)) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    
    setPhoneError("");
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

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    return /^[0-9+\-\s()]*$/.test(phone);
  };

  const handleSaveSupplier = () => {
    const isNameValid = validateName(currentSupplier.name);
    const isEmailValid = validateEmail(currentSupplier.email);
    const isPhoneValid = validatePhone(currentSupplier.phone);
    const isWebsiteValid = validateWebsite(currentSupplier.website);
    
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isWebsiteValid) {
      return;
    }

    if (isEditing) {
      setSuppliers(suppliers.map(supplier => supplier.id === currentSupplier.id ? currentSupplier : supplier));
    } else {
      const newId = suppliers.length > 0 ? Math.max(...suppliers.map(supplier => supplier.id)) + 1 : 1;
      setSuppliers([...suppliers, { ...currentSupplier, id: newId }]);
    }
    
    setIsDialogOpen(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCurrentSupplier({ ...currentSupplier, name: newName });
    
    // Clear error when user starts typing again
    if (nameError) {
      setNameError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setCurrentSupplier({ ...currentSupplier, email: newEmail });
    
    // Clear error when user starts typing again
    if (emailError) {
      setEmailError("");
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setCurrentSupplier({ ...currentSupplier, phone: newPhone });
    
    // Clear error when user starts typing again
    if (phoneError) {
      setPhoneError("");
    }
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWebsite = e.target.value;
    setCurrentSupplier({ ...currentSupplier, website: newWebsite });
    
    // Clear error when user starts typing again
    if (websiteError) {
      setWebsiteError("");
    }
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const openWebsite = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const openWhatsApp = (phone: string) => {
    // Clean up the phone number by removing non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if the phone number starts with '0' and replace with country code
    const whatsappNumber = cleanPhone.startsWith('0') ? `62${cleanPhone.substring(1)}` : cleanPhone;
    
    // Open WhatsApp in a new tab
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Suppliers Management</h1>
        <div className="flex justify-between items-center gap-2">
          <Input 
            type="text" 
            placeholder="Search by name, contact person, email, phone, address or category..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full"
          />
          <Button onClick={handleAddSupplier} className="flex items-center gap-1 whitespace-nowrap">
            <Plus size={18} /> 
            <span className="hidden sm:inline">Add New Supplier</span>
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="hidden md:table-cell">Contact Person</TableHead>
              <TableHead className="hidden md:table-cell">Contact Info</TableHead>
              <TableHead className="hidden lg:table-cell">Address</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-32 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                    <p>No suppliers found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredSuppliers.map((supplier, index) => (
              <TableRow key={supplier.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{supplier.name}</span>
                    {supplier.website && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <Globe size={12} />
                        <button 
                          onClick={() => openWebsite(supplier.website)}
                          className="hover:underline truncate max-w-[120px]"
                        >
                          {supplier.website.replace(/^https?:\/\//, '')}
                        </button>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {supplier.contactPerson || <span className="text-gray-400">—</span>}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Phone size={14} className="text-gray-500" />
                      <span>{supplier.phone}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 ml-1 rounded-full text-green-600 hover:text-green-700 hover:bg-green-50" 
                              onClick={() => openWhatsApp(supplier.phone)}
                            >
                              <MessageSquare size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Chat on WhatsApp</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {supplier.email && (
                      <div className="flex items-center gap-1">
                        <Mail size={14} className="text-gray-500" />
                        <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:underline">
                          {supplier.email}
                        </a>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-start gap-1">
                    <MapPin size={14} className="text-gray-500 mt-1 flex-shrink-0" />
                    <span className="whitespace-normal break-words">
                      {supplier.address}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getCategoryName(supplier.categoryId) === "Primary" 
                      ? "bg-blue-100 text-blue-800" 
                      : getCategoryName(supplier.categoryId) === "Distributor"
                        ? "bg-green-100 text-green-800"
                        : getCategoryName(supplier.categoryId) === "Manufacturer"
                          ? "bg-purple-100 text-purple-800"
                          : getCategoryName(supplier.categoryId) === "International"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                  }`}>
                    {getCategoryName(supplier.categoryId)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    supplier.status === "active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
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
                        onClick={() => handleEditSupplier(supplier)}
                        className="cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
                        Edit
                      </DropdownMenuItem>
                      {supplier.website && (
                        <DropdownMenuItem 
                          onClick={() => openWebsite(supplier.website)}
                          className="cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                          Visit Website
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => openWhatsApp(supplier.phone)}
                        className="cursor-pointer text-green-600"
                      >
                        <MessageSquare size={16} className="mr-2" />
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteSupplier(supplier.id)}
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
            <DialogTitle>{isEditing ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
            <DialogDescription>
              Please fill in all required fields marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center">
                Company Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                value={currentSupplier.name}
                onChange={handleNameChange}
                className={`w-full transition-colors ${nameError ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="Supplier company name"
                autoFocus
              />
              {nameError && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠️</span> {nameError}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="contactPerson">
                Contact Person <span className="text-xs text-gray-500 ml-2">(optional)</span>
              </Label>
              <Input
                id="contactPerson"
                value={currentSupplier.contactPerson}
                onChange={(e) => setCurrentSupplier({ ...currentSupplier, contactPerson: e.target.value })}
                className="w-full"
                placeholder="Name of primary contact"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone" className="flex items-center">
                Phone <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="phone"
                value={currentSupplier.phone}
                onChange={handlePhoneChange}
                className={`w-full transition-colors ${phoneError ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="e.g., 081234567890"
              />
              {phoneError && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠️</span> {phoneError}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-xs text-gray-500 ml-2">(optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={currentSupplier.email}
                onChange={handleEmailChange}
                className={`w-full transition-colors ${emailError ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="company@example.com"
              />
              {emailError && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠️</span> {emailError}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="website">
                Website <span className="text-xs text-gray-500 ml-2">(optional)</span>
              </Label>
              <Input
                id="website"
                type="url"
                value={currentSupplier.website}
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
              <Label htmlFor="address">
                Address <span className="text-xs text-gray-500 ml-2">(optional)</span>
              </Label>
              <Input
                id="address"
                value={currentSupplier.address}
                onChange={(e) => setCurrentSupplier({ ...currentSupplier, address: e.target.value })}
                className="w-full"
                placeholder="Supplier address"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Supplier Category</Label>
              <Select
                value={currentSupplier.categoryId.toString()}
                onValueChange={(value) => setCurrentSupplier({ ...currentSupplier, categoryId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={currentSupplier.status}
                onValueChange={(value) => setCurrentSupplier({ ...currentSupplier, status: value })}
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
            <Button onClick={handleSaveSupplier} className="min-w-[80px]">
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
