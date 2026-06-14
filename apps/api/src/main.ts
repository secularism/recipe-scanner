
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";



// 强制设置 DATABASE_URL（从 .env 文件读取）

const fs = require('fs');

const path = require('path');

const dotenvPath = path.resolve(__dirname, '..', '.env');

if (fs.existsSync(dotenvPath)) {

  const content = fs.readFileSync(dotenvPath, 'utf8');

  content.split('\n').forEach((line: string) => {

    if (line.trim() && !line.startsWith('#')) {

      const [key, ...valueParts] = line.split('=');

      const value = valueParts.join('=').replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

      process.env[key.trim()] = value;

    }

  });

}



async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  await app.listen(process.env.APP_PORT || 3000);

}

void bootstrap();

