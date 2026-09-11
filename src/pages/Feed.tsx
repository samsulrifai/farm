import type { Feed } from '../domain'
import { fmt, money } from '../domain'
import { Summary, Table } from '../components/ui'

export function FeedPage({ items, stock }: { items: Feed[]; stock: number }) { return <><section className="feed-summary"><Summary label="STOK SAAT INI" value={`${fmt(stock)} kg`} /><Summary label="STOK MINIMUM" value="2.700 kg" warn={stock < 2700} /></section><Table note="Mutasi keluar tidak dapat melebihi stok."><thead><tr><th>Jenis</th><th>Kg</th><th>Harga/kg</th><th>Catatan</th></tr></thead><tbody>{items.map(x => <tr key={x.id}><td data-label="Jenis"><span className={`status ${x.kind === 'Masuk' ? 'ok' : 'warn'}`}>{x.kind}</span></td><td data-label="Kg">{fmt(x.qty)}</td><td data-label="Harga">{x.price ? money(x.price) : '—'}</td><td data-label="Catatan">{x.note || '—'}</td></tr>)}</tbody></Table></> }
