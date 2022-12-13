import { Router } from 'express'
import { getCoinHystoryData } from "../controllers/coins-history";
import {getCoinsMarketsData} from "../controllers/coins-market";

const router = Router();

router.get("/coins/:id/market_charts?", getCoinHystoryData);

router.get("/coins/markets?", getCoinsMarketsData);

export default router;
