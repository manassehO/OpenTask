export async function convertCurrency(
  from: string,
  to: string,
  amount = 1,
): Promise<number> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${to}&vs_currencies=${from}`,
      { cache: 'no-store' },
    );

    if (!res.ok) throw new Error(`CoinGecko error: ${res.statusText}`);

    const data = await res.json();
    const rate = data[to]?.[from];

    if (!rate) {
      console.warn('Conversion rate not found:', { from, to, data });
      return 0;
    }

    return amount / rate;
  } catch (error) {
    console.error('CoinGecko conversion error:', error);
    return 0;
  }
}
