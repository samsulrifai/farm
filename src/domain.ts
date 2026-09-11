export type Nav = 'Dashboard' | 'Produksi' | 'Pakan' | 'Penjualan' | 'Kesehatan' | 'Kandang' | 'Keuangan' | 'Laporan'
export type ModalName = 'entry' | 'feed' | 'sale' | 'expense' | 'health' | 'flock' | 'payment' | null
export type Flock = { id: string; name: string; strain: string; started: string; hens: number; target: number; active: boolean }
export type Entry = { id: string; date: string; flockId: string; total: number; cracked: number; feed: number; deaths: number; note: string }
export type Feed = { id: string; date: string; kind: 'Masuk' | 'Keluar'; qty: number; price: number; note: string }
export type Sale = { id: string; date: string; customer: string; unit: 'tray' | 'butir' | 'kg'; qty: number; price: number; paid: number; due: string }
export type Expense = { id: string; date: string; category: string; amount: number; note: string }
export type Health = { id: string; date: string; flockId: string; kind: 'Vaksin' | 'Obat' | 'Gejala' | 'Karantina'; detail: string; qty: number; nextDate: string; note: string }
export const today = new Date().toISOString().slice(0, 10)
export const navItems: Nav[] = ['Dashboard', 'Produksi', 'Pakan', 'Penjualan', 'Kesehatan', 'Kandang', 'Keuangan', 'Laporan']
export const icons: Record<Nav, string> = { Dashboard: '◫', Produksi: '◌', Pakan: '▧', Penjualan: '◈', Kesehatan: '✚', Kandang: '⌂', Keuangan: '◉', Laporan: '▤' }
export const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n)
export const money = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
export const eggQty = (sale: Sale) => sale.unit === 'tray' ? sale.qty * 30 : sale.unit === 'butir' ? sale.qty : 0
export function description(page: Nav) { return ({ Dashboard: 'Ringkasan usaha berdasarkan tanggal terpilih.', Produksi: 'Satu catatan per kandang per hari.', Pakan: 'Kontrol stok dan mutasi pakan.', Penjualan: 'Kelola invoice, stok telur, dan piutang.', Kesehatan: 'Riwayat vaksin, obat, gejala, dan karantina.', Kandang: 'Master kandang dan batch ayam aktif.', Keuangan: 'Pendapatan, biaya, dan laba rugi operasional.', Laporan: 'Ekspor ringkasan operasional.' } as Record<Nav, string>)[page] }
