import type { Nav } from '../domain'
import { fmt, money } from '../domain'

export function Dashboard({ eggs, eggStock, feedStock, revenue, onGo }: { eggs: number; eggStock: number; feedStock: number; revenue: number; onGo: (x: Nav) => void }) { return <><section className="metric-grid"><Metric label="Telur layak jual" value={fmt(eggs)} suffix="butir" tone="mint" /><Metric label="Stok telur" value={fmt(Math.max(0, eggStock))} suffix="butir" tone="blue" /><Metric label="Stok pakan" value={fmt(feedStock)} suffix="kg" tone="amber" /><Metric label="Omzet" value={money(revenue)} suffix="" tone="violet" /></section><section className="content-grid"><article className="panel"><p className="eyebrow">AKSI CEPAT</p><h2>Operasional hari ini</h2><div className="quick-grid"><button className="quick-action" onClick={() => onGo('Produksi')}>◌ Produksi</button><button className="quick-action" onClick={() => onGo('Kesehatan')}>✚ Kesehatan</button><button className="quick-action" onClick={() => onGo('Keuangan')}>◉ Keuangan</button></div></article><article className="panel"><p className="eyebrow">PERLU PERHATIAN</p><h2>Alert</h2><Alert text="Piutang terbuka" action="Tinjau" onClick={() => onGo('Penjualan')} /><Alert text="Vaksin & kesehatan" action="Lihat" onClick={() => onGo('Kesehatan')} /></article></section></> }


function Alert({ text, action, onClick }: { text: string; action: string; onClick: () => void }) { return <div className="alert-row"><span className="alert-icon orange">!</span><b>{text}</b><button onClick={onClick}>{action}</button></div> }


function Metric({ label, value, suffix, tone }: { label: string; value: string; suffix: string; tone: string }) { return <article className={`metric-card ${tone}`}><p>{label}</p><div><strong>{value}</strong><span>{suffix}</span></div><small>Data tanggal terpilih</small></article> }
