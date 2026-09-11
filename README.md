# FarmTelur frontend

Dashboard operasional peternakan telur. React + Vite + TypeScript. Saat ini memakai mock data, belum terhubung backend.

## Jalankan

```bash
npm install
npm run dev
```

## Cek sebelum kirim perubahan

```bash
npm run lint
npm run build
```

## Struktur sengaja sederhana

- `src/App.tsx`: dashboard dan mock data.
- `src/index.css`: token visual dan seluruh style.
- Belum memakai router, state manager, UI kit, atau API client.

## Catatan maintenance

1. Saat backend tersedia, pindahkan `flocks` dari `App.tsx` ke `src/features/dashboard/api.ts`; gunakan TanStack Query hanya ketika API cache/mutasi benar-benar dibutuhkan.
2. Pecah `App.tsx` berdasarkan halaman/fitur ketika halaman kedua dibuat atau komponen dipakai ulang. Jangan pecah menjadi komponen atom satu-baris.
3. Jangan masukkan credential/API key ke frontend. Backend menangani login, otorisasi, validasi, audit log, dan database.
4. Tetap gunakan TypeScript untuk kontrak data; validasi respons API di batas API.

**ponytail:** UI ini frontend demonstrasi. Tambahkan backend PostgreSQL dan autentikasi sebelum dipakai untuk data operasional nyata.
