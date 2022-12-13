import express from 'express';
import cors from 'cors';
import path from "path";
import dotenv from 'dotenv';
dotenv.config();
import router from "./routes/router";
import { connectToDatabases } from "./connections/database";
import { PORT } from "./config/config";
import Logger from "./utils/logger";

const app = express();

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(router);

app.get('/', (req:any, res:any) => { return res.status(200).json({ message: 'success' }) });

app.listen(PORT, () => {
    Logger.warn(`Server is running on PORT: ${PORT}`)
});

connectToDatabases()
