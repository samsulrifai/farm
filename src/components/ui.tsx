export function Table({ note, children }: { note: string; children: React.ReactNode }) { return <section className="panel production-list"><div className="validation-note">{note}</div><div className="table-wrap"><table>{children}</table></div></section> }

export function Empty({ col }: { col: number }) { return <tr><td className="empty" colSpan={col}>Belum ada data untuk tanggal ini.</td></tr> }

export function Delete({ onClick, label = 'Hapus' }: { onClick: () => void; label?: string }) { return <button className="danger-button" onClick={onClick}>{label}</button> }

export function Summary({ label, value, warn }: { label: string; value: string; warn?: boolean }) { return <article className="panel"><p className="eyebrow">{label}</p><strong>{value}</strong><p className={warn ? 'bad' : 'good'}>{warn ? '● Perlu perhatian' : '✓ Terkendali'}</p></article> }

export function Report({ label, value }: { label: string; value: string }) { return <article className="panel report-card"><p className="eyebrow">{label}</p><strong>{value}</strong></article> }
