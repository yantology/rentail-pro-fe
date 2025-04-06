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
import { Pencil, Trash2, Plus, AlertCircle, MoreVertical, Copy, Wallet, CreditCard, Landmark, Banknote } from "lucide-react"
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

export const Route = createFileRoute('/tenant/master-data/cash-and-bank')({
  component: RouteComponent,
})

// Available payment method types
const paymentMethodTypes = [
  { id: "bank", name: "Bank Account", icon: <Landmark size={16} /> },
  { id: "cash", name: "Cash", icon: <Banknote size={16} /> },
  { id: "wallet", name: "Digital Wallet", icon: <Wallet size={16} /> },
  { id: "card", name: "Card", icon: <CreditCard size={16} /> }
];

// Dummy data for the payment methods
const dummyPaymentMethods = [
  { 
    id: 1, 
    name: "Bank Central Asia (BCA)", 
    code: "014",
    accountNumber: "1234567890",
    accountName: "PT Rentail Pro Indonesia",
    branch: "Jakarta Pusat",
    swift: "CENAIDJA",
    type: "bank",
    status: "active"
  },
  { 
    id: 2, 
    name: "Bank Mandiri", 
    code: "008",
    accountNumber: "9876543210",
    accountName: "PT Rentail Pro Indonesia",
    branch: "Bandung",
    swift: "BMRIIDJA",
    type: "bank",
    status: "active"
  },
  { 
    id: 3, 
    name: "Cashier 01", 
    code: "CASH01",
    accountNumber: "",
    accountName: "Store Cashier 1",
    branch: "Main Store",
    swift: "",
    type: "cash",
    status: "active"
  },
  { 
    id: 4, 
    name: "GoPay", 
    code: "GOPAY",
    accountNumber: "081234567890",
    accountName: "PT Rentail Pro Indonesia",
    branch: "",
    swift: "",
    type: "wallet",
    status: "active"
  },
  { 
    id: 5, 
    name: "Cashier 02", 
    code: "CASH02",
    accountNumber: "",
    accountName: "Store Cashier 2",
    branch: "Branch Store",
    swift: "",
    type: "cash",
    status: "inactive"
  },
  { 
    id: 6, 
    name: "CIMB Niaga", 
    code: "022",
    accountNumber: "6543210987",
    accountName: "PT Rentail Pro Indonesia",
    branch: "Jakarta Selatan",
    swift: "BNIAIDJA",
    type: "bank",
    status: "active"
  },
  { 
    id: 7, 
    name: "Visa Credit Card", 
    code: "VISA",
    accountNumber: "4111111111111111",
    accountName: "PT Rentail Pro Indonesia",
    branch: "",
    swift: "",
    type: "card",
    status: "active"
  },
  { 
    id: 8, 
    name: "DANA", 
    code: "DANA",
    accountNumber: "089876543210",
    accountName: "PT Rentail Pro Indonesia",
    branch: "",
    swift: "",
    type: "wallet",
    status: "active"
  }
];

function RouteComponent() {
  const [paymentMethods, setPaymentMethods] = useState(dummyPaymentMethods);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState({ 
    id: 0, 
    name: "", 
    code: "", 
    accountNumber: "", 
    accountName: "", 
    branch: "", 
    swift: "",
    type: "bank",
    status: "active" 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");
  const [accountNameError, setAccountNameError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Filter payment methods based on search query and type filter
  const filteredPaymentMethods = paymentMethods.filter(method => {
    // Filter by type first
    if (typeFilter !== "all" && method.type !== typeFilter) {
      return false;
    }
    
    // Then filter by search query
    return (
      method.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      method.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      method.accountNumber.includes(searchQuery) ||
      method.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (method.branch && method.branch.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (method.swift && method.swift.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleAddPaymentMethod = () => {
    setIsEditing(false);
    setCurrentPaymentMethod({ 
      id: 0, 
      name: "", 
      code: "", 
      accountNumber: "", 
      accountName: "", 
      branch: "", 
      swift: "",
      type: "bank",
      status: "active" 
    });
    resetErrors();
    setIsDialogOpen(true);
  };

  const handleEditPaymentMethod = (method: SetStateAction<{ 
    id: number; 
    name: string; 
    code: string; 
    accountNumber: string; 
    accountName: string; 
    branch: string; 
    swift: string;
    type: string;
    status: string 
  }>) => {
    setIsEditing(true);
    setCurrentPaymentMethod(method);
    resetErrors();
    setIsDialogOpen(true);
  };

  const handleDeletePaymentMethod = (id: number) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    }
  };

  const resetErrors = () => {
    setNameError("");
    setAccountNumberError("");
    setAccountNameError("");
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
    
    setNameError("");
    return true;
  };

  const validateAccountNumber = (accountNumber: string, type: string): boolean => {
    // Only require account numbers for bank accounts and cards
    if ((type === "bank" || type === "card" || type === "wallet") && !accountNumber.trim()) {
      setAccountNumberError("Account/Card number is required for this payment type");
      return false;
    }
    
    if (type === "bank" && accountNumber && !/^\d+$/.test(accountNumber)) {
      setAccountNumberError("Bank account number must contain only digits");
      return false;
    }
    
    setAccountNumberError("");
    return true;
  };

  const validateAccountName = (accountName: string): boolean => {
    if (!accountName.trim()) {
      setAccountNameError("Account name is required");
      return false;
    }
    
    if (accountName.trim().length < 3) {
      setAccountNameError("Account name must be at least 3 characters");
      return false;
    }
    
    setAccountNameError("");
    return true;
  };

  const handleSavePaymentMethod = () => {
    const isNameValid = validateName(currentPaymentMethod.name);
    const isAccountNumberValid = validateAccountNumber(currentPaymentMethod.accountNumber, currentPaymentMethod.type);
    const isAccountNameValid = validateAccountName(currentPaymentMethod.accountName);
    
    if (!isNameValid || !isAccountNumberValid || !isAccountNameValid) {
      return;
    }

    if (isEditing) {
      setPaymentMethods(paymentMethods.map(method => method.id === currentPaymentMethod.id ? currentPaymentMethod : method));
    } else {
      const newId = paymentMethods.length > 0 ? Math.max(...paymentMethods.map(method => method.id)) + 1 : 1;
      setPaymentMethods([...paymentMethods, { ...currentPaymentMethod, id: newId }]);
    }
    
    setIsDialogOpen(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCurrentPaymentMethod({ ...currentPaymentMethod, name: newName });
    
    // Clear error when user starts typing again
    if (nameError) {
      setNameError("");
    }
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAccountNumber = e.target.value;
    setCurrentPaymentMethod({ ...currentPaymentMethod, accountNumber: newAccountNumber });
    
    // Clear error when user starts typing again
    if (accountNumberError) {
      setAccountNumberError("");
    }
  };

  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAccountName = e.target.value;
    setCurrentPaymentMethod({ ...currentPaymentMethod, accountName: newAccountName });
    
    // Clear error when user starts typing again
    if (accountNameError) {
      setAccountNameError("");
    }
  };

  const handleTypeChange = (value: string) => {
    setCurrentPaymentMethod({ ...currentPaymentMethod, type: value });
    
    // Clear any errors that might not be applicable to the new type
    if (accountNumberError && (value === "cash")) {
      setAccountNumberError("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    alert("Copied to clipboard: " + text);
  };

  // Get the icon for a payment method type
  const getTypeIcon = (type: string) => {
    const methodType = paymentMethodTypes.find(t => t.id === type);
    return methodType ? methodType.icon : <Landmark size={16} />;
  };

  // Get the name of a payment method type
  const getTypeName = (type: string) => {
    const methodType = paymentMethodTypes.find(t => t.id === type);
    return methodType ? methodType.name : "Unknown";
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Cash & Bank Management</h1>
        <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
          <div className="w-full sm:w-1/3">
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center">
                    <span className="mr-2">All Types</span>
                  </span>
                </SelectItem>
                {paymentMethodTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <span className="flex items-center">
                      <span className="mr-2">{type.icon}</span>
                      {type.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-full sm:w-2/3 gap-2">
            <Input 
              type="text" 
              placeholder="Search payment methods..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full"
            />
            <Button onClick={handleAddPaymentMethod} className="flex items-center gap-1 whitespace-nowrap">
              <Plus size={18} /> 
              <span className="hidden sm:inline">Add New</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Account Details</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPaymentMethods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                    <p>No payment methods found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPaymentMethods.map((method, index) => (
              <TableRow key={method.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {getTypeIcon(method.type)}
                    </div>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-xs text-gray-500">Code: {method.code}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    method.type === "bank" 
                      ? "bg-blue-100 text-blue-800" 
                      : method.type === "cash"
                        ? "bg-green-100 text-green-800"
                        : method.type === "wallet"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-amber-100 text-amber-800"
                  }`}>
                    {getTypeName(method.type)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="font-medium">{method.accountName}</div>
                    {method.accountNumber && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-mono">{method.accountNumber}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 rounded-full hover:bg-slate-100" 
                                onClick={() => copyToClipboard(method.accountNumber)}
                              >
                                <Copy size={14} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy account number</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {method.branch || "-"}
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    method.status === "active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {method.status.charAt(0).toUpperCase() + method.status.slice(1)}
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
                        onClick={() => handleEditPaymentMethod(method)}
                        className="cursor-pointer"
                      >
                        <Pencil size={16} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {method.accountNumber && (
                        <DropdownMenuItem 
                          onClick={() => copyToClipboard(`${method.accountName} - ${method.accountNumber} (${method.name})`)}
                          className="cursor-pointer"
                        >
                          <Copy size={16} className="mr-2" />
                          Copy Details
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeletePaymentMethod(method.id)}
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
            <DialogTitle>{isEditing ? "Edit Payment Method" : "Add New Payment Method"}</DialogTitle>
            <DialogDescription>
              Please fill in all required fields marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Payment Method Type <span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={currentPaymentMethod.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <span className="flex items-center">
                        <span className="mr-2">{type.icon}</span>
                        {type.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center">
                Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                value={currentPaymentMethod.name}
                onChange={handleNameChange}
                className={`w-full transition-colors ${nameError ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="e.g., BCA, Cash Register 1, GoPay"
                autoFocus
              />
              {nameError && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠️</span> {nameError}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="code">
                Code <span className="text-xs text-gray-500 ml-2">(optional)</span>
              </Label>
              <Input
                id="code"
                value={currentPaymentMethod.code}
                onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, code: e.target.value })}
                className="w-full"
                placeholder="e.g., 014, CASH01, GOPAY"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="accountName" className="flex items-center">
                Account/Owner Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="accountName"
                value={currentPaymentMethod.accountName}
                onChange={handleAccountNameChange}
                className={`w-full transition-colors ${accountNameError ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="Name on the account or owner"
              />
              {accountNameError && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠️</span> {accountNameError}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="accountNumber" className={`flex items-center ${
                currentPaymentMethod.type === "cash" ? "text-gray-400" : ""
              }`}>
                {currentPaymentMethod.type === "bank" && "Account Number"}
                {currentPaymentMethod.type === "card" && "Card Number"}
                {currentPaymentMethod.type === "wallet" && "Phone Number"}
                {currentPaymentMethod.type === "cash" && "ID/Reference"}
                
                {currentPaymentMethod.type !== "cash" && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                {currentPaymentMethod.type === "cash" && (
                  <span className="text-xs text-gray-500 ml-2">(optional)</span>
                )}
              </Label>
              <Input
                id="accountNumber"
                value={currentPaymentMethod.accountNumber}
                onChange={handleAccountNumberChange}
                disabled={currentPaymentMethod.type === "cash"}
                className={`w-full transition-colors ${accountNumberError ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder={
                  currentPaymentMethod.type === "bank" 
                    ? "Bank account number" 
                    : currentPaymentMethod.type === "card" 
                      ? "Card number" 
                      : currentPaymentMethod.type === "wallet" 
                        ? "Phone number linked to wallet" 
                        : "Optional reference"
                }
              />
              {accountNumberError && (
                <p className="text-red-500 text-xs flex items-center">
                  <span className="mr-1">⚠️</span> {accountNumberError}
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="branch">
                Location/Branch <span className="text-xs text-gray-500 ml-2">(optional)</span>
              </Label>
              <Input
                id="branch"
                value={currentPaymentMethod.branch}
                onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, branch: e.target.value })}
                className="w-full"
                placeholder="Branch location or physical location"
              />
            </div>
            
            {currentPaymentMethod.type === "bank" && (
              <div className="grid gap-2">
                <Label htmlFor="swift">
                  SWIFT/BIC Code <span className="text-xs text-gray-500 ml-2">(optional)</span>
                </Label>
                <Input
                  id="swift"
                  value={currentPaymentMethod.swift}
                  onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, swift: e.target.value })}
                  className="w-full"
                  placeholder="For international transfers"
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={currentPaymentMethod.status}
                onValueChange={(value) => setCurrentPaymentMethod({ ...currentPaymentMethod, status: value })}
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
            <Button onClick={handleSavePaymentMethod} className="min-w-[80px]">
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
