import type { Entry, Flock } from '../domain'
import { fmt } from '../domain'
import { Empty, Table } from '../components/ui'

export function Production({ items, flocks }: { items: Entry[]; flocks: Flock[] }) { return <Table note="Simpan ulang kandang/tanggal sama akan memperbarui catatan."><thead><tr><th>Kandang</th><th>Total</th><th>Layak jual</th><th>Pakan</th><th>Mati</th></tr></thead><tbody>{items.length ? items.map(e => <tr key={e.id}><td data-label="Kandang"><b>{flocks.find(f => f.id === e.flockId)?.name ?? '—'}</b><small>{e.note || '—'}</small></td><td data-label="Total">{fmt(e.total)}</td><td data-label="Layak jual">{fmt(e.total - e.cracked)}</td><td data-label="Pakan">{e.feed} kg</td><td data-label="Mati">{e.deaths}</td></tr>) : <Empty col={5} />}</tbody></Table> }
