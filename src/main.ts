import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	/** 启用session */
	app.use(
		session({
			secret: 'aioloszhr',
			resave: false,
			saveUninitialized: false
		})
	);
	await app.listen(3000);
}
bootstrap();
