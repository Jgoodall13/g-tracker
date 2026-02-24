import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cyclesRouter from './routes/cycles';
import sessionsRouter from './routes/sessions';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cycles', cyclesRouter);
app.use('/api/sessions', sessionsRouter);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));