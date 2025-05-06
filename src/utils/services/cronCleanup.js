import cron from 'node-cron';
import { Op } from 'sequelize';
import LoginLog from '../models/LoginLogs.js';
import User from '../models/Users.js';

cron.schedule('*/5 * * * *', async () => {
  const now = new Date();

  try {
    const expiryThreshold = new Date(now.getTime() - 4 * 60 * 60 * 1000); // 4 hours

    const expiredLogs = await LoginLog.findAll({
      where: {
        end: null,
        start: { [Op.lt]: expiryThreshold },
      },
    });

    for (const log of expiredLogs) {
      await log.update({ end: now });

      const user = await User.findOne({ where: { credential_id: log.credential_id } });
      if (user && user.status === 'active') {
        await user.update({ status: 'inactive', modified_date: now });
      }

      console.log(`[CRON] Auto-logged out credential_id ${log.credential_id} at ${now.toISOString()}`);
    }

    if (expiredLogs.length === 0) {
      console.log(`[CRON] No expired sessions to log out at ${now.toISOString()}`);
    }
  } catch (error) {
    console.error('[CRON] Auto-logout error:', error);
  }
});
