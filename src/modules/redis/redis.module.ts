import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { ApiConfigService } from '@/shared/services/api-config.service';

@Global()
@Module({
	providers: [
		{
			provide: 'REDIS_CLIENT',
			inject: [ApiConfigService],
			async useFactory(configService: ApiConfigService) {
				const { host, port } = configService.redisConfig;
				const client = createClient({
					socket: { host, port },
					database: 2
				});
				await client.connect();
				return client;
			}
		}
	],
	exports: ['REDIS_CLIENT']
})
export class RedisModule {}
