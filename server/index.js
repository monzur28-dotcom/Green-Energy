import 'dotenv/config';
import app from './app.js';
import { init, driverName } from './db.js';

const PORT = process.env.PORT || 4000;

init()
  .then(() => app.listen(PORT, () => console.log(`Green Energy API (${driverName} db) listening on http://localhost:${PORT}`)))
  .catch(err => { console.error('Failed to initialize database:', err); process.exit(1); });
