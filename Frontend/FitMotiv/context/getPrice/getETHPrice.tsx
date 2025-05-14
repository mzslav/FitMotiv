export const fetchUsdtToEthRate = async (): Promise<number | null> => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=eth'
    );
    const data = await response.json();

    if (data?.tether?.eth) {
      return data.tether.eth;
    } else {
      console.error("Invalid data structure:", data);
      return null;
    }
  } catch (err) {
    console.error("Помилка завантаження курсу:", err);
    return null;
  }
};
