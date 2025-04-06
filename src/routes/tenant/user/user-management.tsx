import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Mail, MoreVertical, Pencil, Trash2, UserCircle2 } from 'lucide-react'

interface User {
  id: number
  email: string
}

export const Route = createFileRoute('/tenant/user/user-management')({
  component: RouteComponent,
})

// Dummy data
const initialUsers: User[] = [
  {
    id: 1,
    email: 'john@example.com'
  },
  {
    id: 2,
    email: 'jane@example.com'
  },
  {
    id: 3,
    email: 'bob@example.com'
  }
]

function RouteComponent() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState<User>({
    id: 0,
    email: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [emailError, setEmailError] = useState('')

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddUser = () => {
    setIsEditing(false)
    setCurrentUser({
      id: 0,
      email: ''
    })
    setEmailError('')
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setIsEditing(true)
    setCurrentUser(user)
    setEmailError('')
    setIsDialogOpen(true)
  }

  const handleDeleteUser = (userId: number) => {
    // Directly delete user without confirmation
    setUsers(users.filter(user => user.id !== userId))
  }

  const validateForm = () => {
    let isValid = true

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!currentUser.email || !emailRegex.test(currentUser.email)) {
      setEmailError('Please enter a valid email address')
      isValid = false
    }

    return isValid
  }

  const handleSaveUser = () => {
    if (!validateForm()) return

    if (isEditing) {
      setUsers(users.map(user => user.id === currentUser.id ? currentUser : user))
    } else {
      const newId = Math.max(...users.map(user => user.id)) + 1
      setUsers([...users, { ...currentUser, id: newId }])
    }
    
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <div className="flex justify-between items-center gap-2">
          <Input 
            type="text" 
            placeholder="Search users by email..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="max-w-sm"
          />
          <Button onClick={handleAddUser}>
            <UserCircle2 className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Mail size={14} className="text-gray-500" />
                    <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                      {user.email}
                    </a>
                  </div>
                </TableCell>
                <TableCell className="text-right">
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
                        onClick={() => handleEditUser(user)}
                        className="cursor-pointer"
                      >
                        <Pencil size={16} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteUser(user.id)}
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
            <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              Enter the user's email address.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center">
                Email <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={currentUser.email}
                onChange={(e) => {
                  setCurrentUser({ ...currentUser, email: e.target.value })
                  if (emailError) setEmailError('')
                }}
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
