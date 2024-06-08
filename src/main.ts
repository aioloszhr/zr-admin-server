import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './setup-swapper';
import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { ResponseResultInterceptor } from './interceptor/response-result.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalInterceptors(new ResponseResultInterceptor());
	/** 获取配置 */
	const configService = app.select(SharedModule).get(ApiConfigService);

	if (configService.documentationEnabled) {
		setupSwagger(app);
	}

	await app.listen(3000);
}
bootstrap();
