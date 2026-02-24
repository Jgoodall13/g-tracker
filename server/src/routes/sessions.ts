import { Router, Request, Response } from 'express';
import { db } from '../db';
import { cycles, sessions } from '../schema';
import { eq, count } from 'drizzle-orm';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { letters, session_date } = req.body;
  try {
    const activeCycle = await db
      .select()
      .from(cycles)
      .where(eq(cycles.isActive, true))
      .limit(1);

    if (!activeCycle.length) {
      res.status(400).json({ error: 'No active cycle' });
      return;
    }

    const cycleId = activeCycle[0].id;
    const gHit = letters.includes('G');

    const countRes = await db
      .select({ count: count() })
      .from(sessions)
      .where(eq(sessions.cycleId, cycleId));

    const dayNumber = Number(countRes[0].count) + 1;

    const newSession = await db
      .insert(sessions)
      .values({ cycleId, dayNumber, sessionDate: session_date, letters, gHit })
      .returning();

    if (gHit) {
      await db
        .update(cycles)
        .set({ isActive: false, endedAt: new Date() })
        .where(eq(cycles.id, cycleId));
    }

    res.json(newSession[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await db.delete(sessions).where(eq(sessions.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

export default router;