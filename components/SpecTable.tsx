type SpecTableProps = {
  kicker: string
  title: string
  description: string
  accent: string
  columns: string[]
  rows: (string | number)[][]
  footnote?: string
}

export default function SpecTable({ kicker, title, description, accent, columns, rows, footnote }: SpecTableProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em]" style={{ color: accent }}>
        {kicker}
      </p>
      <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">{title}</h2>
      <p className="mb-10 max-w-2xl text-sm leading-relaxed text-[#94a3b8] md:text-base">{description}</p>

      <div className="overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02]">
        <table className="w-full min-w-[720px] border-collapse font-mono text-xs md:text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              {columns.map((col, i) => (
                <th
                  key={col}
                  className={`whitespace-nowrap px-4 py-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[#94a3b8] ${
                    i === 0 ? "text-left" : "text-right"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr
                key={String(row[0])}
                className={`transition-colors hover:bg-white/[0.03] ${
                  r < rows.length - 1 ? "border-b border-white/[0.04]" : ""
                }`}
              >
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={`whitespace-nowrap px-4 py-3.5 ${
                      c === 0 ? "text-left font-semibold text-white" : "text-right text-[#b8c7dc]"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnote && <p className="mt-4 text-xs leading-relaxed text-[#94a3b8]/70">{footnote}</p>}
    </div>
  )
}
