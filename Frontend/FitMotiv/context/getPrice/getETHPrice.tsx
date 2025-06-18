export const fetchUsdtToEthRate = async (): Promise<number | null> => {

    const EtherscanApiKey = process.env.EXPO_PUBLIC_EtherscanApiKey

    const apiUrl = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${EtherscanApiKey}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === '1' && data.result?.ethusd) {
            const ethUsdPrice = parseFloat(data.result.ethusd); 

            if (isNaN(ethUsdPrice) || ethUsdPrice === 0) {
                console.error("Invalid ETH/USD price received from Etherscan:", ethUsdPrice);
                return null;
            }
            const usdtToEthRate = 1 / ethUsdPrice;

            return usdtToEthRate;
        } else {
            console.error("Invalid data structure or API error from Etherscan:", data);
            return null;
        }
    } catch (err) {
        console.error("Error while loading ETH/USD from Etherscan:", err);
        return null;
    }
};