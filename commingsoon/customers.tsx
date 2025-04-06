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
import { Pencil, Trash2, Plus, AlertCircle, MoreVertical, Phone, Mail, MapPin, MessageSquare } from "lucide-react"
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

export const Route = createFileRoute('/tenant/master-data/customers')({
  component: RouteComponent,
})

// Dummy data for the customer categories
const dummyCustomerCategories = [
  { id: 1, name: "Regular", code: "REG" },
  { id: 2, name: "VIP", code: "VIP" },
  { id: 3, name: "Corporate", code: "CORP" },
  { id: 4, name: "Wholesale", code: "WHSL" },
  { id: 5, name: "New", code: "NEW" },
];

// Dummy data for the customers table
const dummyCustomers = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john.doe@example.com",
    phone: "081234567890",
    address: "123 Main St, New York, NY 10001",
    categoryId: 2,
    status: "active"
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane.smith@example.com",
    phone: "089876543210",
    address: "456 Park Ave, Boston, MA 02108",
    categoryId: 1,
    status: "active"
  },
  { 
    id: 3, 
    name: "Acme Corp", 
    email: "info@acmecorp.com",
    phone: "087654321098",
    address: "789 Business Blvd, San Francisco, CA 94105",
    categoryId: 3,
    status: "inactive"
  },
  { 
    id: 4, 
    name: "Bob Johnson", 
    email: "bob.johnson@example.com",
    phone: "085432109876",
    address: "321 Oak St, Chicago, IL 60007",
    categoryId: 1,
    status: "active"
  },
  { 
    id: 5, 
    name: "Wholesale Traders Inc.", 
    email: "sales@wholesaletraders.com",
    phone: "082345678901",
    address: "567 Commerce Way, Dallas, TX 75001",
    categoryId: 4,
    status: "inactive"
  },
];

function RouteComponent() {
  const [customers, setCustomers] = useState(dummyCustomers);
  const [categories] = useState(dummyCustomerCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({ 
    id: 0, 
    name: "", 
    email: "", 
    phone: "", 
    address: "", 
    categoryId: 1, 
    status: "active" 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCategoryName(customer.categoryId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = () => {
    setIsEditing(false);
    setCurrentCustomer({ id: 0, name: "", email: "", phone: "", address: "", categoryId: 1, status: "active" });
    resetErrors();
    setIsDialogOpen(true);
  };

  const handleEditCustomer = (customer: SetStateAction<{ id: number; name: string; email: string; phone: string; address: string; categoryId: number; status: string }>) => {
    setIsEditing(true);
    setCurrentCustomer(customer);
    resetErrors();
    setIsDialogOpen(true);
  };

  const handleDeleteCustomer = (id: number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };

  const resetErrors = () => {
    setNameError("");
    setEmailError("");
    setPhoneError("");
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
    
    if (name.trim().length > 100) {
      setNameError("Name must be less than 100 characters");
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

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    return /^[0-9+\-\s()]*$/.test(phone);
  };

  const handleSaveCustomer = () => {
    const isNameValid = validateName(currentCustomer.name);
    const isEmailValid = validateEmail(currentCustomer.email);
    const isPhoneValid = validatePhone(currentCustomer.phone);
    
    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      return;
    }

    if (isEditing) {
      setCustomers(customers.map(customer => customer.id === currentCustomer.id ? currentCustomer : customer));
    } else {
      const newId = customers.length > 0 ? Math.max(...customers.map(customer => customer.id)) + 1 : 1;
      setCustomers([...customers, { ...currentCustomer, id: newId }]);
    }
    
    setIsDialogOpen(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCurrentCustomer({ ...currentCustomer, name: newName });
    
    // Clear error when user starts typing again
    if (nameError) {
      setNameError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setCurrentCustomer({ ...currentCustomer, email: newEmail });
    
    // Clear error when user starts typing again
    if (emailError) {
      setEmailError("");
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setCurrentCustomer({ ...currentCustomer, phone: newPhone });
    
    // Clear error when user starts typing again
    if (phoneError) {
      setPhoneError("");
    }
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown";
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
        <h1 className="text-2xl font-bold mb-4">Customers Management</h1>
        <div className="flex justify-between items-center gap-2">
          <Input 
            type="text" 
            placeholder="Search by name, email, phone, address or category..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full"
          />
          <Button onClick={handleAddCustomer} className="flex items-center gap-1 whitespace-nowrap">
            <Plus size={18} /> 
            <span className="hidden sm:inline">Add New Customer</span>
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden lg:table-cell">Address</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                    <p>No customers found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCustomers.map((customer, index) => (
              <TableRow key={customer.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Phone size={14} className="text-gray-500" />
                      <span>{customer.phone}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 ml-1 rounded-full text-green-600 hover:text-green-700 hover:bg-green-50" 
                              onClick={() => openWhatsApp(customer.phone)}
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
                    {customer.email && (
                      <div className="flex items-center gap-1">
                        <Mail size={14} className="text-gray-500" />
                        <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                          {customer.email}
                        </a>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-start gap-1">
                    <MapPin size={14} className="text-gray-500 mt-1 flex-shrink-0" />
                    <span className="whitespace-normal break-words">
                      {customer.address}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getCategoryName(customer.categoryId) === "VIP" 
                      ? "bg-amber-100 text-amber-800" 
                      : getCategoryName(customer.categoryId) === "Corporate"
                        ? "bg-blue-100 text-blue-800"
                        : getCategoryName(customer.categoryId) === "Wholesale"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                  }`}>
                    {getCategoryName(customer.categoryId)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.status === "active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
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
                        onClick={() => handleEditCustomer(customer)}
                        className="cursor-pointer"
                      >
                        <Pencil size={16} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openWhatsApp(customer.phone)}
                        className="cursor-pointer text-green-600"
                      >
                        <MessageSquare size={16} className="mr-2" />
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="cursor-pointer text-red-600"
                        variant="destructive"
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
            <DialogTitle>{isEditing ? "Edit Customer" : "Add New Customer"}</DialogTitle>
            <DialogDescription>
              Please fill in all required fields marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center">
                Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                value={currentCustomer.name}
                onChange={handleNameChange}
                className={`w-full transition-colors ${nameError ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="Customer name"
                autoFocus
              />
              {nameError && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠️</span> {nameError}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone" className="flex items-center">
                Phone <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="phone"
                value={currentCustomer.phone}
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
                value={currentCustomer.email}
                onChange={handleEmailChange}
                className={`w-full transition-colors ${emailError ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="email@example.com"
              />
              {emailError && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠️</span> {emailError}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address">
                Address <span className="text-xs text-gray-500 ml-2">(optional)</span>
              </Label>
              <Input
                id="address"
                value={currentCustomer.address}
                onChange={(e) => setCurrentCustomer({ ...currentCustomer, address: e.target.value })}
                className="w-full"
                placeholder="Customer address"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Customer Category</Label>
              <Select
                value={currentCustomer.categoryId.toString()}
                onValueChange={(value) => setCurrentCustomer({ ...currentCustomer, categoryId: parseInt(value) })}
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
                value={currentCustomer.status}
                onValueChange={(value) => setCurrentCustomer({ ...currentCustomer, status: value })}
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
            <Button onClick={handleSaveCustomer} className="min-w-[80px]">
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
