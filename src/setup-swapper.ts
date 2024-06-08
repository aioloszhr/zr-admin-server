import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
	/** 使用swagger生成api文档 */
	const documentBuilder = new DocumentBuilder()
		.setTitle('API')
		.setDescription('React后台管理系统接口文档');

	if (process.env.API_VERSION) {
		documentBuilder.setVersion(process.env.API_VERSION);
	}

	const document = SwaggerModule.createDocument(app, documentBuilder.build());
	SwaggerModule.setup('documentation', app, document);

	console.info(`Documentation: http://localhost:${process.env.PORT}/documentation`);
	console.info(`Documentation JSON: http://localhost:${process.env.PORT}/documentation-json`);
}
