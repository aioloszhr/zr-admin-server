import { Global, Module } from '@nestjs/common';
import { AlibabaTongyiEmbeddings } from '@langchain/community/embeddings/alibaba_tongyi';
import { ApiConfigService } from '@/shared/services/api-config.service';

@Global()
@Module({
	providers: [
		{
			provide: 'TONGYI_EMBEDDING',
			inject: [ApiConfigService],
			async useFactory(configService: ApiConfigService) {
				const { apiKey } = configService.tongyiApiConfig;
				const client = new AlibabaTongyiEmbeddings({
					apiKey
				});
				return client;
			}
		}
	],
	exports: ['TONGYI_EMBEDDING']
})
export class EmbeddingModule {}
