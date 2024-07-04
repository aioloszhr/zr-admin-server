import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ApiConfigService } from '@/shared/services/api-config.service';

@Global()
@Module({
	providers: [
		{
			provide: 'REDIS_CLIENT',
			inject: [ApiConfigService],
			async useFactory(configService: ApiConfigService) {
				const { host, port } = configService.redisConfig;
				const client = new Redis({
					host,
					port,
					db: 2
				});
				return client;
			}
		}
	],
	exports: ['REDIS_CLIENT']
})
export class RedisModule {}
