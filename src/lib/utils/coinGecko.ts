/**
 * Convert between a cryptocurrency and a fiat currency using CoinGecko
 * @param from - coin id or fiat (e.g. "bitcoin", "ethereum", "usd", "ngn")
 * @param to - target currency (e.g. "usd", "ngn", "bitcoin")
 * @param amount - value to convert (default 1)
 * @returns converted value (number)
 */
export async function convertCurrency(
  from: string,
  to: string,
  amount: number = 1,
): Promise<number> {
  try {
    // if "from" is fiat and "to" is crypto (e.g. usd → bitcoin)
    if (isFiat(from) && !isFiat(to)) {
      // get price of 1 `to` in `from` fiat
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${to}&vs_currencies=${from}`,
      );

      if (!res.ok) {
        throw new Error(`CoinGecko error: ${res.statusText}`);
      }

      const data = await res.json();
      const rate = data[to]?.[from];

      if (!rate) throw new Error('Conversion rate not found');

      return amount / rate;
    }

    // default: crypto → fiat (or crypto → crypto)
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}`,
    );

    if (!res.ok) {
      throw new Error(`CoinGecko error: ${res.statusText}`);
    }

    const data = await res.json();
    const rate = data[from]?.[to];

    if (!rate) throw new Error('Conversion rate not found');

    return amount * rate;
  } catch (error) {
    console.error('CoinGecko conversion error:', error);
    throw error;
  }
}

/**
 * Simple fiat detection
 */
function isFiat(currency: string): boolean {
  const fiatList = ['usd', 'eur', 'gbp', 'ngn', 'jpy', 'cad'];
  return fiatList.includes(currency.toLowerCase());
}
