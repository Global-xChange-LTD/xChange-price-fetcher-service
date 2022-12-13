import axios from "axios";
import CurrencyMarket from "../models/currencyMarket";
import Logger from "../utils/logger";

export async function getMarketCoinGeckosIds() {
    let coins: any,
        tempArray: Array<string> = [];

    try {
        coins = await CurrencyMarket.find({})
        if (coins == null) {
            Logger.error(`Coins are empty`);
            return;
        }

        for (const coin of coins) {
            tempArray.push(coin.id)
        }

        return tempArray;
    } catch (err: any) {
        Logger.error(`${err}`);
        throw new Error(err)
    }
}

export async function addNewCurrencyMarketCoin(item: any) {
    const marketCoin = new CurrencyMarket({
        id: item.id,
        name: item.name,
        symbol: item.symbol,
        current_price: item.current_price.toString(),
        market_cap: item.market_cap.toString(),
        price_change_percentage_24h: item.price_change_percentage_24h.toString(),
        market_cap_change_24h: item.market_cap_change_24h.toString(),
        market_cap_change_percentage_24h: item.market_cap_change_percentage_24h.toString(),
        total_volume: item.total_volume.toString(),
        circulating_supply: item.circulating_supply.toString(),
    });

    await marketCoin.save()
        .then(()=> {
            Logger.info(`${marketCoin.id} addded to CurrencyMarket collection`);
        })
        .catch((err: any) => {
            throw new Error(err)
        });
}

export async function requestMarketsCoingeckoData(url: string): Promise<any> {
    let response: any[] = [];
    try {
        await axios.get(url)
            .then((res)=> {
                if(res.data){
                    response = res.data;
                }
            });
    } catch (err: any) {
        Logger.error(`Try axios GET ${url} error: ${err}`);
        throw new Error(err);
    }

    return response;
}

export async function updateCurrencyMarketData(){
    let coins = await getMarketCoinGeckosIds();

    if(coins && coins.length > 0) {
        let url = `${process.env.COINGECKO_API_URL}coins/markets?ids=${coins.join('%2C')}&vs_currency=usd`,
            data = await requestMarketsCoingeckoData(url);

        for (const item of data) {
            let record = {
                id: item.id,
                name: item.name,
                symbol: item.symbol,
                current_price: item.current_price.toString(),
                market_cap: item.market_cap.toString(),
                price_change_percentage_24h: item.price_change_percentage_24h.toString(),
                market_cap_change_24h: item.market_cap_change_24h.toString(),
                market_cap_change_percentage_24h: item.market_cap_change_percentage_24h.toString(),
                total_volume: item.total_volume.toString(),
                circulating_supply: item.circulating_supply.toString()
            }

            await CurrencyMarket.findOneAndUpdate({id: record.id}, record, {
                new: true,
                upsert: true
            }).catch((err: any) => {
                Logger.error(`${err}`);
                throw new Error(err);
            });
        }
    }
}

export async function getExchangeRate(currency: any): Promise<number> {
    let url = `${process.env.EXCHANGE_RATE_API}&?base=usd&symbols=${currency}}`,
    returnValue: number = 1;
    await axios.get(url)
        .then((response)=> {
            if(response && response.data) {
                returnValue = response.data.rates[currency]
            }
        })
        .catch((err)=> {
            Logger.error(`Try axios GET ${url} error: ${err}`);
            throw new Error(err);
        })

    return returnValue
}

