import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import './firebase';

const PORT = process.env.PORT || 5000;



async function start() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  await app.listen(PORT, () => console.log(`server was started on ${PORT} port`));
}
start();
