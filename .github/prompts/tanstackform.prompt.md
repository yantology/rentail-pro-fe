// Dokumentasi TanStack Form Login dengan Validasi Zod (2025)
// --------------------------------------------------------

// 1. Instalasi Paket yang Diperlukan
// npm install @tanstack/react-form zod

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

// 2. Membuat Skema Validasi dengan Zod - Validasi Password yang Lebih Kompleks
const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[a-z]/, 'Password harus mengandung minimal 1 huruf kecil')
    .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf besar')
    .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka')
    .regex(/[^a-zA-Z0-9]/, 'Password harus mengandung minimal 1 karakter khusus')
});

// 3. Tipe yang dihasilkan dari skema
type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  // 4. Inisialisasi form dengan TanStack Form
  const form = useForm<LoginFormValues>({
    // Nilai default form
    defaultValues: {
      email: '',
      password: ''
    },
    
    // 5. Menerapkan validasi di tingkat form
    validators: {
      onSubmit: async ({ value }) => {
        try {
          // Validasi menggunakan Zod
          loginSchema.parse(value);
          return; // Jika validasi berhasil, tidak mengembalikan error
        } catch (err) {
          if (err instanceof z.ZodError) {
            // Mengembalikan pesan error dari Zod
            return 'Data login tidak valid';
          }
          return 'Terjadi kesalahan saat validasi';
        }
      }
    },
    
    // 6. Menangani submission form
    onSubmit: async ({ value }) => {
      try {
        // Lakukan API call untuk login
        console.log('Mengirim data login:', value);
        
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulasi error dari server
        if (value.email === 'error@example.com') {
          return {
            status: 'error',
            message: 'Email atau password tidak valid'
          };
        }
        
        return { status: 'success' };
      } catch (error) {
        console.error('Error saat submit:', error);
        return { 
          status: 'error', 
          message: 'Gagal terhubung ke server' 
        };
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* 7. Email Field dengan validasi Zod */}
        <form.Field
          name="email"
          validators={{
            onChange: (value) => {
              try {
                // Menggunakan schema Zod khusus untuk field email
                loginSchema.shape.email.parse(value);
                return undefined; // Tidak ada error
              } catch (error) {
                if (error instanceof z.ZodError) {
                  // Mengembalikan pesan error dari Zod
                  return error.errors[0].message;
                }
                return 'Email tidak valid';
              }
            }
          }}
        >
          {(field) => (
            <div className="mb-4">
              <label 
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id={field.name}
                name={field.name}
                type="email"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  field.state.meta.errors ? 'border-red-500' : 'border-gray-300'
                }`}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors ? (
                <p className="mt-1 text-sm text-red-600">
                  {field.state.meta.errors.join(', ')}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>
        
        {/* 8. Password Field dengan validasi Zod - Menampilkan Semua Error */}
        <form.Field
          name="password"
          validators={{
            onChange: (value) => {
              // Array untuk menyimpan semua pesan error
              const errors = [];
              
              // Validasi panjang password
              if (!value || value.length < 8) {
                errors.push('Password minimal 8 karakter');
              }
              
              // Validasi huruf kecil
              if (!value || !/[a-z]/.test(value)) {
                errors.push('Password harus mengandung minimal 1 huruf kecil');
              }
              
              // Validasi huruf besar
              if (!value || !/[A-Z]/.test(value)) {
                errors.push('Password harus mengandung minimal 1 huruf besar');
              }
              
              // Validasi angka
              if (!value || !/[0-9]/.test(value)) {
                errors.push('Password harus mengandung minimal 1 angka');
              }
              
              // Validasi karakter khusus
              if (!value || !/[^a-zA-Z0-9]/.test(value)) {
                errors.push('Password harus mengandung minimal 1 karakter khusus');
              }
              
              // Jika ada error, kembalikan array error pertama
              // Penggunaan [0] disini karena field.state.meta.errors hanya mengambil error pertama
              // Kita akan menampilkan semua error di UI
              return errors.length > 0 ? errors[0] : undefined;
            }
          }}
        >
          {(field) => (
            <div className="mb-6">
              <label 
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id={field.name}
                name={field.name}
                type="password"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  field.state.meta.errors ? 'border-red-500' : 'border-gray-300'
                }`}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              
              {/* Bagian untuk menampilkan semua kriteria password dengan indikator status */}
              <div className="mt-2 text-sm">
                <p className="font-medium mb-1">Password harus memenuhi kriteria:</p>
                <ul className="space-y-1 list-disc pl-5">
                  <li className={!field.state.value || field.state.value.length < 8 ? 'text-red-600' : 'text-green-600'}>
                    Minimal 8 karakter
                  </li>
                  <li className={!field.state.value || !/[a-z]/.test(field.state.value) ? 'text-red-600' : 'text-green-600'}>
                    Mengandung minimal 1 huruf kecil
                  </li>
                  <li className={!field.state.value || !/[A-Z]/.test(field.state.value) ? 'text-red-600' : 'text-green-600'}>
                    Mengandung minimal 1 huruf besar
                  </li>
                  <li className={!field.state.value || !/[0-9]/.test(field.state.value) ? 'text-red-600' : 'text-green-600'}>
                    Mengandung minimal 1 angka
                  </li>
                  <li className={!field.state.value || !/[^a-zA-Z0-9]/.test(field.state.value) ? 'text-red-600' : 'text-green-600'}>
                    Mengandung minimal 1 karakter khusus
                  </li>
                </ul>
              </div>
            </div>
          )}
        </form.Field>
        
        {/* 9. Tampilkan pesan error dari form submission */}
        <form.Subscribe
          selector={(state) => [
            state.submitAttempt > 0 && state.submitError,
            state.isSubmitting
          ]}
        >
          {([submitError, isSubmitting]) => (
            <>
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
                  {submitError.message || submitError}
                </div>
              )}
              
              {/* 10. Submit button dengan status */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Sedang Login...' : 'Login'}
              </button>
            </>
          )}
        </form.Subscribe>
        
        {/* 11. Tampilkan pesan sukses jika login berhasil */}
        <form.Subscribe selector={(state) => state.isSubmitSuccessful}>
          {(isSubmitSuccessful) => 
            isSubmitSuccessful && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
                Login berhasil!
              </div>
            )
          }
        </form.Subscribe>
      </form>
    </div>
  );
};

export default LoginForm;

// 12. Cara Penggunaan dalam Aplikasi
// ---------------------------------
// import React from 'react';
// import LoginForm from './LoginForm';
//
// function App() {
//   return (
//     <div className="container mx-auto py-10">
//       <LoginForm />
//     </div>
//   );
// }
//
// export default App;

/*
CATATAN PENTING:

1. Validasi Password yang Lebih Kompleks:
   - Menggunakan regex untuk memvalidasi berbagai komponen password (huruf kecil, huruf besar, angka, karakter khusus)
   - Menampilkan semua kriteria password dengan indikator status (merah/hijau)
   - Memberikan feedback visual yang jelas tentang kriteria yang sudah terpenuhi

2. Validasi dengan Zod di Schema:
   - Skema Zod dengan regex untuk memvalidasi kompleksitas password
   - Pesan error yang spesifik untuk setiap kriteria validasi

3. Validasi Field yang Lebih Rinci:
   - Manual validation untuk menampilkan semua kriteria password
   - Indikator visual untuk setiap kriteria (merah/hijau)
   - Tampilan checklist yang user-friendly

4. Penanganan Error:
   - Error dari validasi password ditampilkan sebagai checklist
   - Error dari submission form ditampilkan di atas tombol submit
   - Indikator visual yang jelas untuk status form dan field

5. Referensi:
   - Dokumentasi resmi: https://tanstack.com/form/latest
   - Basic concepts: https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts
   - Submission handling: https://tanstack.com/form/latest/docs/framework/react/guides/submission-handling
*/