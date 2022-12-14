export const FiatExchanges: { [key: string]: string } = {
    USD: 'usd',
    EUR: 'eur'
};

export async function getFiatExchanges(){
    let fiatArr: string[] = []
    Object.values(FiatExchanges).forEach((item)=> {
        fiatArr.push(item);
    });

    return fiatArr;
}

export const CoinsCode: { [key: string]: string } = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    USD_COIN: 'usd-coin',
    USDT: 'tether',
    CHANGE: 'changex',
    UNISWAP: 'uniswap',
    LINK: 'chainlink',
    DOGECOIN: 'dogecoin',
    LITECOIN: 'litecoin',
    BITCOIN_CASH: 'bitcoin-cash'
};

export async function getCoinsCodeStringByValue(){
    let coinsArr: string[] = []
     Object.values(CoinsCode).forEach((item)=> {
        coinsArr.push(item);
    });

    return coinsArr;
}

