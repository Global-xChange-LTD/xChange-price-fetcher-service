import axios from "axios";
import CurrencyMarket from "../models/currencyMarket";
import Logger from "../utils/logger";
import { COINGECKO_API_URL } from "../config/config";
import { getFiatExchanges } from "../enums/coin-enums";

export async function getMarketCoinGeckosIds() {
    let coins: any;

    try {
        coins = await CurrencyMarket.distinct("id")
        if (coins == null) {
            Logger.info('Coins are empty');
            return;
        }

        return coins;

    } catch (err: any) {
        throw new Error(err)
    }
}

export async function addNewCurrencyMarketCoin(item: any) {
    const marketCoin = new CurrencyMarket({
        id: item.id,
        name: item.name,
        symbol: item.symbol,
        current_price:  item.current_price,
        market_cap: item.market_cap,
        price_change_percentage_24h: item.price_change_percentage_24h,
        market_cap_change_24h: item.market_cap_change_24h,
        market_cap_change_percentage_24h: item.market_cap_change_percentage_24h,
        total_volume: item.total_volume,
        circulating_supply: item.circulating_supply,
        exchange_rate: item.exchange_rate
    });

    await marketCoin.save()
        .then(()=> {
            Logger.info(`New Coin addded to CurrencyMarket collection ${ marketCoin.id} ${marketCoin.exchange_rate}` );
        })
        .catch((err: any) => {
            throw new Error(err)
        });
}

export async function requestMarketsCoingeckoData(coins: any): Promise<any> {
    let response: any[] = [],
        fiatExchangeRates = await getFiatExchanges();

    for (const exchange_rate of fiatExchangeRates) {
        let url = `${COINGECKO_API_URL}coins/markets?ids=${coins.join('%2C')}&vs_currency=${exchange_rate}`;

        //Replace is done because sometimes " ` " is replaced with encoding %27,
        let encodedURL = url.replace('%27,', '');

        try {
            await axios.get(url)
                .then((res)=> {
                    if(res.data) {
                        for (let item of res.data) {
                            item.exchange_rate = exchange_rate;
                            response.push(item);
                        }
                    }
                });
        } catch (err) {
            throw new Error(`${new Date().getTime()} : ${url}} error: ${err}`);
        }
    }

    return response;
}

export async function updateCurrencyMarketData(){
    let coins = await getMarketCoinGeckosIds();

    if(coins && coins.length > 0) {
        try {
            let data = await requestMarketsCoingeckoData(coins);

            if(data && data.length > 0) {
                for (const item of data) {
                    let record = {
                        id: item.id,
                        name: item.name,
                        symbol: item.symbol,
                        current_price:  item.current_price,
                        market_cap: item.market_cap,
                        price_change_percentage_24h: item.price_change_percentage_24h,
                        market_cap_change_24h: item.market_cap_change_24h,
                        market_cap_change_percentage_24h: item.market_cap_change_percentage_24h,
                        total_volume: item.total_volume,
                        circulating_supply: item.circulating_supply,
                        exchange_rate: item.exchange_rate
                    };

                    await CurrencyMarket.findOneAndUpdate({id: record.id, exchange_rate: record.exchange_rate}, record, {
                        new: true,
                        upsert: true
                    }).catch((err: any) => {
                        Logger.error(`CurrencyMarket findOneAndUpdate: ${ err}`);
                        throw  Error(err);
                    });
                }
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }
}

