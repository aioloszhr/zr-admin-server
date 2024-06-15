import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './setup-swapper';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	setupSwagger(app);

	await app.listen(3000);
}
bootstrap();
