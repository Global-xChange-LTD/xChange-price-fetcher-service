import { Router } from 'express'
import { getCoinHystoryData } from "../controllers/coins-history";
import { getCoinsMarketsData } from "../controllers/coins-market";
import { getDatabaseConnectionStatus } from "../connections/healthcheck";

const router = Router();

router.get("/coins/:id/market_charts?", getCoinHystoryData);

router.get("/coins/markets?", getCoinsMarketsData);

router.get("/status/db", getDatabaseConnectionStatus);

export default router;
