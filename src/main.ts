import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	/** 使用swagger生成api文档 */
	const config = new DocumentBuilder()
		.setTitle('React Admin Server')
		.setDescription('React后台管理系统接口文档')
		.setVersion('1.0')
		.addTag('Nest')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('doc', app, document);

	await app.listen(3000);
}
bootstrap();
