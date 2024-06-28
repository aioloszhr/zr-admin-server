import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { setupSwagger } from './setup-swapper';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	setupSwagger(app);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	);

	app.useWebSocketAdapter(new WsAdapter(app));

	await app.listen(3000);
}
bootstrap();
