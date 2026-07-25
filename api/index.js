import app from '../server/app.js';
import { init } from '../server/db.js';

// Cold-start init, memoized across warm invocations of the same function instance.
let ready;

export default async function handler(req, res) {
  if (!ready) ready = init();
  await ready;
  return app(req, res);
}
