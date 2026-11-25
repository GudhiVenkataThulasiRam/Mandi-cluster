export default function ChartCard({ title, note, children }) {
  return (
    <section className="card" aria-label={title}>
      <div className="card-head">
        <div>
          <h2>{title}</h2>
          {note && <p className="muted">{note}</p>}
        </div>
      </div>
      <div className="chart-body">
        {children}
      </div>
    </section>
  )
}
