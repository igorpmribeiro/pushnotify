import 'dotenv/config';
import { loadEnv } from './config/env.js';
import { buildApp } from './app.js';

async function main() {
  const env = loadEnv();
  const app = await buildApp(env);

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`Server running on http://${env.HOST}:${env.PORT}`);
  } catch (error) {
    app.log.fatal(error, 'Failed to start server');
    process.exit(1);
  }
}

main();
