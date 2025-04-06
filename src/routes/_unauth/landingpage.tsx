import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import {
  Check,
  Building2,
  UsersRound,
  PackageSearch,
  ShoppingCart,
  ChevronRight,
  Store,
  Mail,
  Phone,
  Linkedin,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { cn } from '../../lib/utils'

export const Route = createFileRoute('/_unauth/landingpage')({
  component: RouteComponent,
})

// Feature type definition for better type safety
type Feature = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  longDescription: string;
  color: string;
  textColor: string;
  hoverColor: string;
  benefits: string[];
  image?: string;
}

function RouteComponent() {
  const [contactOpen, setContactOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState<string>('multi-tenant')
  const [animateFeature, setAnimateFeature] = useState(false)

  // Features data structured as an object for better access by ID
  const featuresData: Record<string, Feature> = {
    'multi-tenant': {
      id: 'multi-tenant',
      icon: <Building2 className="h-8 w-8" />,
      title: "Arsitektur Multi-Tenant",
      description: "Kelola tak terbatas toko dalam satu platform yang tangguh",
      longDescription: "Jalankan beberapa toko, waralaba, atau lokasi ritel dengan data terisolasi dan manajemen terpadu. Setiap tenant beroperasi secara independen sambil berbagi infrastruktur umum.",
      color: "from-indigo-900 to-indigo-950",
      textColor: "text-indigo-400",
      hoverColor: "hover:text-indigo-300",
      benefits: [
        "pengaturan independen untuk setiap toko",
        "Skala dari satu toko hingga ratusan tanpa mengubah platform",
      ],
      image: "/img/management-tenang.png"
    },
    'team': {
      id: 'team',
      icon: <UsersRound className="h-8 w-8" />,
      title: "Manajemen Tim",
      description: "Kontrol akses berbasis peran dan alat kolaborasi",
      longDescription: "Berdayakan tim Anda dengan peran dan izin yang ditentukan dengan tepat. Buat level akses khusus untuk manajer, kasir, spesialis inventaris, dan lainnya.",
      color: "from-blue-900 to-blue-950",
      textColor: "text-blue-400", 
      hoverColor: "hover:text-blue-300",
      benefits: [
        "Akun pengguna tak terbatas dengan izin khusus",
        "Log aktivitas dan jejak audit(coming soon)",
      ],
      image: "/img/role-management.png"
    },
    'inventory': {
      id: 'inventory',
      icon: <PackageSearch className="h-8 w-8" />,
      title: "Manajemen Inventaris",
      description: "Lacak produk, varian, dan tingkat stok di semua lokasi",
      longDescription: "Jaga kontrol yang tepat atas inventaris Anda di semua lokasi dengan tingkat stok real-time, peringatan otomatis, dan transfer mulus antar toko.",
      color: "from-purple-900 to-purple-950", 
      textColor: "text-purple-400",
      hoverColor: "hover:text-purple-300",
      benefits: [
        "Pelacakan inventaris real-time di semua lokasi",
        "Impor dan ekspor batch",
        "Pemesanan ulang otomatis dan peringatan stok rendah",
        "Pelacakan nomor seri dan batch"
      ],
      image: "/img/inventory.png"
    },
    'pos': {
      id: 'pos',
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "Point of Sale",
      description: "Sistem kasir cepat dan fleksibel yang dirancang untuk penjualan volume tinggi",
      longDescription: "Proses penjualan dengan cepat dengan antarmuka intuitif yang dioptimalkan untuk layar sentuh dan pintasan keyboard. Berfungsi secara offline ketika koneksi internet Anda gagal.",
      color: "from-cyan-900 to-cyan-950", 
      textColor: "text-cyan-400",
      hoverColor: "hover:text-cyan-300",
      benefits: [
        "Berfungsi online dengan sinkronisasi otomatis",
        "Beberapa metode pembayaran termasuk contactless(coming soon)",
        "Opsi tampilan untuk pelanggan",      ],
      image: "/img/pos-interface.png"
    },
   
  };

  // Convert object to array for mapping
  const featuresArray = Object.values(featuresData);

  // Function to animate feature transition
  const handleFeatureChange = (featureId: string) => {
    if (featureId === activeFeature) return;
    
    setAnimateFeature(true);
    setTimeout(() => {
      setActiveFeature(featureId);
      setAnimateFeature(false);
    }, 300);
  };

  // Auto-rotate features every 5 seconds (only if user hasn't interacted)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = featuresArray.findIndex(f => f.id === activeFeature);
      const nextIndex = (currentIndex + 1) % featuresArray.length;
      handleFeatureChange(featuresArray[nextIndex].id);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeFeature, featuresArray]);

  // Get the currently active feature
  const currentFeature = featuresData[activeFeature];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-indigo-400" />
            <span className="font-bold text-xl text-white">RentailPro</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-zinc-400 hover:text-white">Fitur</a>
            <a href="#benefits" className="text-zinc-400 hover:text-white">Keuntungan</a>
            <a href="#testimonials" className="text-zinc-400 hover:text-white">Testimoni</a>
            <a href="#faq" className="text-zinc-400 hover:text-white">FAQ</a>
          </div>
          <div className="flex space-x-4">
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setContactOpen(true)}>
              <span>Hubungi Kami</span>
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Kelola Semua Toko Anda di Satu Tempat
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-10">
              Jalankan Beberapa Toko, Kelola Tim, dan Lacak Penjualan dengan Mudah dalam Satu Platform
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white" onClick={() => setContactOpen(true)}>
                Hubungi Kami Sekarang
              </Button>
            </div>
            <div className="mt-16 relative">
              <div className="bg-zinc-900 shadow-xl rounded-lg border border-zinc-800 overflow-hidden">
                <img 
                  src="/img/management-tenang.png" 
                  alt="Contoh Dashboard" 
                  className="w-full h-auto opacity-90"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/1200x600/111111/444444?text=Dashboard+Multi-Tenant";
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section - Enhanced and Optimized */}
        <section id="features" className="py-24 bg-zinc-950 relative overflow-hidden">
          {/* Dynamic background glow based on active feature */}
          <div className="absolute inset-0 opacity-30">
            <div className={`absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-gradient-to-r ${currentFeature.color} filter blur-[140px] transition-colors duration-700`}></div>
            <div className={`absolute bottom-[15%] right-[10%] w-72 h-72 rounded-full bg-gradient-to-r ${currentFeature.color} filter blur-[140px] transition-colors duration-700`}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center mb-3 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
                <span className="text-zinc-400 font-medium text-sm">Bayangkan ulang bisnis Anda</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 leading-tight">
                Alat Canggih untuk Ritel Modern
              </h2>
              <p className="text-zinc-400 mx-auto text-lg">
                Platform kami menyediakan semua yang Anda butuhkan untuk mengelola kerajaan ritel Anda, dari satu toko hingga jaringan global, semuanya dalam satu sistem yang tangguh.
              </p>
            </div>

            {/* Features navigation tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {featuresArray.map(feature => (
                <button 
                  key={feature.id}
                  onClick={() => handleFeatureChange(feature.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                    activeFeature === feature.id 
                      ? `bg-gradient-to-r ${feature.color} ${feature.textColor} shadow-lg` 
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                  )}
                >
                  <span className={activeFeature === feature.id ? "opacity-100" : "opacity-70"}>
                    {feature.icon && <span className="w-4 h-4">{feature.icon}</span>}
                  </span>
                  {feature.title}
                </button>
              ))}
            </div>

            {/* Feature showcase - main content */}
            <div className={`grid md:grid-cols-2 gap-10 items-center transition-opacity duration-300 ${animateFeature ? 'opacity-0' : 'opacity-100'}`}>
              {/* Feature details */}
              <div className="space-y-8 order-2 md:order-1">
                <div>
                  <div className={`inline-block p-3 rounded-2xl bg-gradient-to-br ${currentFeature.color} mb-6`}>
                    <div className={`${currentFeature.textColor}`}>
                      {currentFeature.icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white flex items-start">
                    {currentFeature.title}
                  </h3>
                  <p className="text-zinc-300 text-lg mb-6">
                    {currentFeature.longDescription}
                  </p>
                </div>

                <div className="space-y-3">
                  {currentFeature.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                      <div className={`mt-0.5 rounded-full bg-zinc-800 p-1 ${currentFeature.textColor}`}>
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-zinc-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button 
                    variant="ghost" 
                    className={`group ${currentFeature.textColor} ${currentFeature.hoverColor} text-base flex items-center`}
                    onClick={() => setContactOpen(true)}
                  >
                    Hubungi Kami 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
              
              {/* Feature visual */}
              <div className="relative order-1 md:order-2">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${currentFeature.color} rounded-2xl blur opacity-50`}></div>
                <div className="relative bg-zinc-900 rounded-2xl p-1 overflow-hidden border border-zinc-800 shadow-2xl">
                  {/* Browser-like header */}
                  <div className="flex items-center gap-1.5 py-2 px-4 bg-zinc-950 rounded-t-xl border-b border-zinc-800">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-zinc-700"></div>
                      <div className="h-3 w-3 rounded-full bg-zinc-700"></div>
                      <div className="h-3 w-3 rounded-full bg-zinc-700"></div>
                    </div>
                    <div className="ml-4 flex-1 bg-zinc-800 h-5 rounded-full"></div>
                  </div>
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img 
                      src={currentFeature.image || "/img/pos-interface.png"}
                      alt={`Antarmuka ${currentFeature.title}`}
                      className="w-full object-cover rounded-b-xl transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/1200x750/111111/333333?text=${currentFeature.title.replace(/\s+/g, '+')}`;
                      }}
                    />
                    {/* Reflection effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                      <div className={`text-sm font-medium rounded-full px-3 py-1 bg-zinc-900/80 backdrop-blur-sm ${currentFeature.textColor}`}>
                        {currentFeature.title}
                      </div>
                      <div className="text-xs bg-zinc-900/80 backdrop-blur-sm rounded-full px-3 py-1 text-zinc-400">
                        RentailPro™
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional features highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
              {featuresArray.slice(0, 3).map(feature => (
                <Card key={feature.id} className="bg-zinc-900/70 border-zinc-800 backdrop-blur-sm hover:shadow-lg transition-all hover:shadow-black/20">
                  <CardContent className="pt-6">
                    <div className={`p-2 mb-4 rounded-lg bg-gradient-to-br ${feature.color} w-10 h-10 flex items-center justify-center`}>
                      <div className={feature.textColor}>{feature.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-zinc-400">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              Mengapa Pemilik Bisnis Memilih Kami
            </h2>
            
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="rounded-full bg-indigo-900/50 p-1">
                      <Check className="h-6 w-6 text-indigo-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-white">Kembangkan Bisnis Anda Tanpa Kesulitan Mengelola Banyak Alat</h3>
                    <p className="text-zinc-400">
                      Perluas bisnis ritel Anda dengan platform terpadu kami yang tumbuh bersama Anda.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="rounded-full bg-purple-900/50 p-1">
                      <Check className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-white">Berikan Tim Anda Akses yang Tepat Tanpa Mengorbankan Keamanan</h3>
                    <p className="text-zinc-400">
                      Izin berbasis peran memastikan anggota tim Anda hanya melihat yang mereka butuhkan.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="rounded-full bg-blue-900/50 p-1">
                      <Check className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-white">Kontrol Terpusat, Manajemen Lokal</h3>
                    <p className="text-zinc-400">
                      Awasi semua operasi dari kantor pusat sambil memberdayakan manajer lokal dengan alat yang mereka butuhkan.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="rounded-full bg-cyan-900/50 p-1">
                      <Check className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-white">Buat Keputusan Berbasis Data di Seluruh Bisnis Anda</h3>
                    <p className="text-zinc-400">
                      Bandingkan kinerja antar lokasi dan identifikasi peluang untuk pertumbuhan dengan analitik real-time.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <img 
                  src="/img/role-management.png" 
                  alt="Antarmuka Manajemen Peran" 
                  className="rounded-lg shadow-lg border border-zinc-800 opacity-90"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x500/111111/444444?text=Manajemen+Peran";
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-zinc-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Apa Kata Pelanggan Kami
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <Card className="bg-gradient-to-br from-zinc-900 to-indigo-950/30 border-zinc-800 transform transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4 ring-2 ring-indigo-900/50">
                      <AvatarImage src="/testimonial-1.jpg" alt="Sarah Johnson" />
                      <AvatarFallback className="bg-indigo-900 text-white">SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-white">Sarah Johnson</p>
                      <p className="text-sm text-zinc-400">Pemilik Jaringan Ritel</p>
                    </div>
                  </div>
                  <p className="italic text-zinc-300">
                    "Mengelola 3 toko dulunya kacau—platform ini menghemat waktu saya 10+ jam seminggu! Sekarang saya bisa fokus pada pengembangan bisnis daripada sibuk dengan spreadsheet."
                  </p>
                </CardContent>
              </Card>
              
              {/* Testimonial 2 */}
              <Card className="bg-gradient-to-br from-zinc-900 to-blue-950/30 border-zinc-800 transform transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4 ring-2 ring-blue-900/50">
                      <AvatarImage src="/testimonial-2.jpg" alt="Michael Rodriguez" />
                      <AvatarFallback className="bg-blue-900 text-white">MR</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-white">Michael Rodriguez</p>
                      <p className="text-sm text-zinc-400">CEO Grup Restoran</p>
                    </div>
                  </div>
                  <p className="italic text-zinc-300">
                    "Kemampuan untuk mengelola setiap restoran secara terpisah tetapi melihat laporan konsolidasi telah menjadi game-changer. Staf kami beradaptasi dengan sistem dalam hitungan hari."
                  </p>
                </CardContent>
              </Card>
              
              {/* Testimonial 3 */}
              <Card className="bg-gradient-to-br from-zinc-900 to-purple-950/30 border-zinc-800 transform transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4 ring-2 ring-purple-900/50">
                      <AvatarImage src="/testimonial-3.jpg" alt="Priya Patel" />
                      <AvatarFallback className="bg-purple-900 text-white">PP</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-white">Priya Patel</p>
                      <p className="text-sm text-zinc-400">Pemilik Butik Fashion</p>
                    </div>
                  </div>
                  <p className="italic text-zinc-300">
                    "Manajemen inventaris di seluruh butik saya sangat lancar. Saya dapat melacak gaya mana yang terjual di setiap lokasi dan menyesuaikan pembelian saya dengan tepat."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
              Pertanyaan yang Sering Diajukan
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* FAQ Item 1 */}
              <div className="bg-zinc-900 p-6 rounded-lg shadow-sm border border-zinc-800 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-indigo-400">Bisakah saya mengelola harga berbeda untuk setiap toko?</h3>
                <p className="text-zinc-400">
                  Ya, setiap toko dapat memiliki katalog produknya sendiri dengan harga khusus, sambil tetap dikelola dari dasbor pusat.
                </p>
              </div>
              
              {/* FAQ Item 2 */}
              <div className="bg-zinc-900 p-6 rounded-lg shadow-sm border border-zinc-800 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-purple-400">Seberapa aman akses pengguna untuk tim saya?</h3>
                <p className="text-zinc-400">
                  Platform kami menggunakan kontrol akses berbasis peran, memungkinkan Anda untuk menentukan dengan tepat apa yang dapat dilihat dan dimodifikasi oleh setiap anggota tim di setiap toko.
                </p>
              </div>
              
              {/* FAQ Item 3 */}
              <div className="bg-zinc-900 p-6 rounded-lg shadow-sm border border-zinc-800 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-blue-400">Bagaimana cara memulai dengan RentailPro?</h3>
                <p className="text-zinc-400">
                  Hubungi tim kami untuk konsultasi dan demonstrasi produk yang disesuaikan dengan kebutuhan bisnis Anda.
                </p>
              </div>
              
              {/* FAQ Item 4 */}
              <div className="bg-zinc-900 p-6 rounded-lg shadow-sm border border-zinc-800 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-violet-400">Dukungan apa yang termasuk?</h3>
                <p className="text-zinc-400">
                  Semua paket termasuk dukungan email dan chat. Paket premium kami juga menyertakan onboarding khusus dan dukungan telepon prioritas.
                </p>
              </div>
              
              {/* FAQ Item 5 */}
              <div className="bg-zinc-900 p-6 rounded-lg shadow-sm border border-zinc-800 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-indigo-400">Apakah ada batasan berapa banyak toko yang bisa saya kelola?</h3>
                <p className="text-zinc-400">
                  Tidak, platform kami dirancang untuk tumbuh bersama bisnis Anda. Anda dapat mengelola sebanyak mungkin toko yang Anda butuhkan dalam satu akun.
                </p>
              </div>
              
              {/* FAQ Item 6 */}
              <div className="bg-zinc-900 p-6 rounded-lg shadow-sm border border-zinc-800 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-purple-400">Bagaimana cara kerja pelaporan di beberapa toko?</h3>
                <p className="text-zinc-400">
                  Mesin pelaporan kami memungkinkan Anda untuk melihat laporan terkonsolidasi di semua toko atau menelusuri kinerja lokasi individu hanya dengan beberapa klik.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section (replacing CTA) */}
        <section className="py-16 bg-gradient-to-r from-indigo-900 to-violet-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ingin Tahu Lebih Banyak Tentang RentailPro?
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-10">
              Tim kami siap menjawab pertanyaan Anda dan memberikan informasi lebih lanjut tentang platform kami.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-indigo-700 hover:bg-blue-50" onClick={() => setContactOpen(true)}>
              Hubungi Kami Sekarang <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-10 mt-auto border-t border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} RentailPro. Seluruh hak cipta dilindungi.</p>
            <Button 
              variant="outline" 
              onClick={() => setContactOpen(true)} 
              className="border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-white"
            >
              Hubungi Kami
            </Button>
          </div>
        </div>
      </footer>

      {/* Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-white mb-2">Mari Terhubung</DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              Jangan ragu untuk menghubungi kami melalui saluran berikut
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center p-3 bg-zinc-800 rounded-lg transition-all hover:bg-zinc-700">
              <Phone className="h-5 w-5 mr-4 text-indigo-400" />
              <div>
                <p className="font-medium text-white">Telepon</p>
                <p className="text-zinc-400">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-zinc-800 rounded-lg transition-all hover:bg-zinc-700">
              <Mail className="h-5 w-5 mr-4 text-indigo-400" />
              <div>
                <p className="font-medium text-white">Email</p>
                <p className="text-zinc-400">contact@rentailpro.com</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-zinc-800 rounded-lg transition-all hover:bg-zinc-700">
              <Linkedin className="h-5 w-5 mr-4 text-indigo-400" />
              <div>
                <p className="font-medium text-white">LinkedIn</p>
                <p className="text-zinc-400">linkedin.com/in/rentailpro</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setContactOpen(false)} 
            className="mt-4 w-full bg-zinc-800 hover:bg-zinc-700 text-white border-none"
          >
            <X className="h-4 w-4 mr-2" /> Tutup
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}