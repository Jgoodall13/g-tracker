import { Router, Request, Response } from 'express';
import { db } from '../db';
import { cycles, sessions } from '../schema';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/active', async (req: Request, res: Response) => {
  try {
    const activeCycle = await db
      .select()
      .from(cycles)
      .where(eq(cycles.isActive, true))
      .limit(1);

    if (!activeCycle.length) {
      res.json({ cycle: null, sessions: [] });
      return;
    }

    const cycleSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.cycleId, activeCycle[0].id))
      .orderBy(sessions.dayNumber);

    res.json({ cycle: activeCycle[0], sessions: cycleSessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/reset', async (req: Request, res: Response) => {
  try {
    await db
      .update(cycles)
      .set({ isActive: false, endedAt: new Date() })
      .where(eq(cycles.isActive, true));

    const newCycle = await db
      .insert(cycles)
      .values({ isActive: true })
      .returning();

    res.json(newCycle[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

export default router;