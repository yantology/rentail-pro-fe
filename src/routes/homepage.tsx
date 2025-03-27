import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { Header } from '@/components/custom/header'


export const Route = createFileRoute('/homepage')({
  component: RouteComponent,
})

// Dummy data untuk tenant
const dummyTenants = [
  {
    id: '1',
    name: 'Tenant A',
    description: 'Premium office space in city center',
    status: 'active',
  },
  {
    id: '2',
    name: 'Tenant B',
    description: 'Retail space with high foot traffic',
    status: 'active',
  },
  {
    id: '3',
    name: 'Tenant C',
    description: 'Warehouse in industrial district',
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Tenant D',
    description: 'Co-working space with modern amenities',
    status: 'active',
  },
]

function RouteComponent() {
  const [tenants] = useState(dummyTenants)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Dummy function untuk filter tenant
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedStatus === 'all') return matchesSearch
    return matchesSearch && tenant.status === selectedStatus
  })

  // Dummy function untuk generate inisial
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Dummy function untuk handle tambah tenant
  const handleAddTenant = () => {
    setShowAddModal(true)
  }

  // Dummy function untuk handle click tenant
  const handleTenantClick = (tenantId: string) => {
    console.log(`Navigating to tenant dashboard: ${tenantId}`)
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Manajemen Tenant</h1>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder="Cari tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-[300px]"
              />
            </div>

            {/* Add Tenant Button */}
            <Button onClick={handleAddTenant}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Tenant
            </Button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex gap-2">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('all')}
            >
              Semua
            </Button>
            <Button
              variant={selectedStatus === 'active' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('active')}
            >
              Aktif
            </Button>
            <Button
              variant={selectedStatus === 'inactive' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('inactive')}
            >
              Non-aktif
            </Button>
          </div>
        </div>

        {/* Tenants Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTenants.map((tenant) => (
            <Card
              key={tenant.id}
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => handleTenantClick(tenant.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar/Initials */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-semibold text-primary">
                        {getInitials(tenant.name)}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{tenant.name}</CardTitle>
                  </div>
                  
                  {/* Status Badge */}
                  <div
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      tenant.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {tenant.status === 'active' ? 'Aktif' : 'Non-aktif'}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground">{tenant.description}</p>
              </CardContent>
              
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Klik untuk melihat detail
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Add Tenant Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Tambah Tenant Baru</CardTitle>
              </CardHeader>
              
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Tenant</label>
                    <Input placeholder="Masukkan nama tenant" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deskripsi</label>
                    <textarea
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Deskripsi tenant..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="status"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="status" className="text-sm font-medium">
                      Status Aktif
                    </label>
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Batal
                </Button>
                <Button
                  onClick={() => {
                    console.log('Saving new tenant...')
                    setShowAddModal(false)
                  }}
                >
                  Simpan
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </>
  )
}
