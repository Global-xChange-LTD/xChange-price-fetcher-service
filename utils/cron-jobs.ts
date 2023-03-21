import { CronJob } from 'cron'
import { updateChartHistory } from '../services/coins.history.service';
import { updateCurrencyMarketData } from "../services/coins.market.service";
import Logger from "./logger";

export const updateCoinsData = () => {
    //At every 43 seconds.
    new CronJob('*/57 * * * * *', async () =>{
        await updateCurrencyMarketData()
            .catch(err => {
                Logger.error(`When updating currency market on 57 seconds :, ${err}, 'message:' + ${err.message}`);
            })
    }).start();

    //At every 10th minute past every hour.
    new CronJob('*/10 */1 * * *', async () =>{
        await updateChartHistory(1)
            .catch(err => {
                Logger.error(`Try axios GET 1 day data error: ${err}`);
            });

    }).start();

    //At minute 14 past every 2nd hour.
    new CronJob('14 */2 * * * ', async () => {
        await updateChartHistory(7)
            .catch(err => {
                Logger.error(`Try axios GET 7 day data error: ${err.message}`);
            });
    }).start();

    //At minute 26 past every 12th hour
    new CronJob('26 */12 * * *', async () => {
        await updateChartHistory(30)
            .catch(err => {
                Logger.error(`Try axios GET 30 day data error: ${err.message}`);
            });
    }).start();

    //At minute 41 past every 24th hour.
    new CronJob('41 */24 * * *', async () => {
        await updateChartHistory(365)
            .catch(err => {
                Logger.error(`Try axios GET 365 day data error: ${err.message}`);
            });
    }).start();
}
