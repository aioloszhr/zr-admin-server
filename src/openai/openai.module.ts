import { Global, Module } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { ApiConfigService } from '@/shared/services/api-config.service';

@Global()
@Module({
	providers: [
		{
			provide: 'KIMIAPI_CLIENT',
			inject: [ApiConfigService],
			async useFactory(configService: ApiConfigService) {
				const { apiKey, modelName, baseUrl } = configService.aiConfig;
				const client = new ChatOpenAI({
					openAIApiKey: apiKey,
					modelName,
					configuration: {
						baseURL: baseUrl
					}
				});
				return client;
			}
		}
	],
	exports: ['KIMIAPI_CLIENT']
})
export class OpenaiModule {}
