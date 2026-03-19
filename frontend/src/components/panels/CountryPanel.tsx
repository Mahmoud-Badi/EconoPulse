export function CountryPanel() {
  const countries = [
    { name: 'United States', flag: '\u{1F1FA}\u{1F1F8}', gdp: '25.46T', inflation: '3.4', unemployment: '3.7', currency: 'USD' },
    { name: 'China', flag: '\u{1F1E8}\u{1F1F3}', gdp: '17.96T', inflation: '0.2', unemployment: '5.2', currency: 'CNY' },
    { name: 'Germany', flag: '\u{1F1E9}\u{1F1EA}', gdp: '4.07T', inflation: '2.9', unemployment: '3.1', currency: 'EUR' },
    { name: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', gdp: '4.23T', inflation: '2.8', unemployment: '2.5', currency: 'JPY' },
    { name: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}', gdp: '3.07T', inflation: '4.0', unemployment: '4.3', currency: 'GBP' },
    { name: 'France', flag: '\u{1F1EB}\u{1F1F7}', gdp: '2.78T', inflation: '3.7', unemployment: '7.3', currency: 'EUR' },
    { name: 'India', flag: '\u{1F1EE}\u{1F1F3}', gdp: '3.73T', inflation: '5.1', unemployment: '7.8', currency: 'INR' },
    { name: 'Brazil', flag: '\u{1F1E7}\u{1F1F7}', gdp: '2.13T', inflation: '4.5', unemployment: '7.9', currency: 'BRL' },
    { name: 'Canada', flag: '\u{1F1E8}\u{1F1E6}', gdp: '2.14T', inflation: '3.1', unemployment: '5.8', currency: 'CAD' },
    { name: 'Australia', flag: '\u{1F1E6}\u{1F1FA}', gdp: '1.69T', inflation: '4.1', unemployment: '3.9', currency: 'AUD' },
    { name: 'South Korea', flag: '\u{1F1F0}\u{1F1F7}', gdp: '1.66T', inflation: '3.3', unemployment: '2.7', currency: 'KRW' },
    { name: 'Italy', flag: '\u{1F1EE}\u{1F1F9}', gdp: '2.01T', inflation: '1.8', unemployment: '7.2', currency: 'EUR' },
    { name: 'Spain', flag: '\u{1F1EA}\u{1F1F8}', gdp: '1.40T', inflation: '3.5', unemployment: '11.8', currency: 'EUR' },
    { name: 'Mexico', flag: '\u{1F1F2}\u{1F1FD}', gdp: '1.32T', inflation: '4.7', unemployment: '2.8', currency: 'MXN' },
    { name: 'Russia', flag: '\u{1F1F7}\u{1F1FA}', gdp: '1.86T', inflation: '7.4', unemployment: '2.9', currency: 'RUB' },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-accent-amber font-mono text-sm font-bold uppercase tracking-wider">World Economies</h1>
      <div className="text-text-dim text-[10px] font-mono">Data sourced from World Bank and IMF estimates</div>

      <div className="bg-bg-panel border border-border-default rounded overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-border-default text-text-dim">
              <th className="p-2 text-left">Country</th>
              <th className="p-2 text-right">GDP (USD)</th>
              <th className="p-2 text-right">Inflation %</th>
              <th className="p-2 text-right">Unemployment %</th>
              <th className="p-2 text-right">Currency</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((c) => (
              <tr key={c.name} className="border-b border-border-default hover:bg-bg-hover transition-colors">
                <td className="p-2">
                  <span className="mr-2">{c.flag}</span>
                  <span className="text-text-primary">{c.name}</span>
                </td>
                <td className="p-2 text-right text-text-primary font-semibold">${c.gdp}</td>
                <td className="p-2 text-right">
                  <span className={parseFloat(c.inflation) > 3 ? 'text-accent-red' : 'text-accent-green'}>{c.inflation}%</span>
                </td>
                <td className="p-2 text-right">
                  <span className={parseFloat(c.unemployment) > 5 ? 'text-accent-red' : 'text-accent-green'}>{c.unemployment}%</span>
                </td>
                <td className="p-2 text-right text-text-secondary">{c.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
