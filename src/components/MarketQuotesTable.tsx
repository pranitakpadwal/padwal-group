import type { MarketSymbol } from "@/data/markets";
import type { MarketQuote } from "@/lib/markets";

function formatPrice(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 10 ? 4 : 2,
  });
}

export default function MarketQuotesTable({
  symbols,
  quotes,
}: {
  symbols: MarketSymbol[];
  quotes: Map<string, MarketQuote>;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm">
        <thead className="bg-brand-soft/60 text-xs uppercase tracking-wide text-[--muted]">
          <tr>
            <th className="px-4 py-2 font-medium">Market</th>
            <th className="px-4 py-2 font-medium text-right">Price (USD)</th>
            <th className="px-4 py-2 font-medium text-right">Today</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {symbols.map((item) => {
            const quote = quotes.get(item.symbol);
            const isUp = quote !== undefined && quote.change > 0;
            const isDown = quote !== undefined && quote.change < 0;
            const changeColor = isUp
              ? "text-emerald-500"
              : isDown
                ? "text-rose-500"
                : "text-neutral-400";
            return (
              <tr key={item.symbol}>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{item.name}</div>
                  <div className="text-xs text-foreground/60">{item.description}</div>
                </td>
                <td className="px-4 py-3 text-right align-top">
                  {quote ? (
                    <>
                      <span className="font-medium tabular-nums">${formatPrice(quote.price)}</span>
                      <span className="block text-xs text-foreground/50">{item.unit}</span>
                    </>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </td>
                <td className={`px-4 py-3 text-right align-top tabular-nums ${changeColor}`}>
                  {quote
                    ? `${quote.change >= 0 ? "▲" : "▼"} ${Math.abs(quote.changePercent).toFixed(2)}%`
                    : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
