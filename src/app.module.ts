import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MenuModule } from './modules/menu/menu.module';
import { RedisModule } from './modules/redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { AuthMiddleware } from './middleware/auth';

@Module({
	imports: [
		AuthModule,
		UserModule,
		MenuModule,
		/** 注册redis */
		RedisModule,
		/** 注册配置文件 */
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [`.env.${process.env.NODE_ENV}`]
		}),
		TypeOrmModule.forRootAsync({
			imports: [SharedModule],
			useFactory: (configService: ApiConfigService) => configService.mysqlConfig,
			inject: [ApiConfigService],
			dataSourceFactory: async options => {
				if (!options) {
					throw new Error('Invalid options passed');
				}
				const dataSource = await new DataSource(options).initialize();
				return dataSource;
			}
		}),
		CacheModule.register({
			isGlobal: true,
			ttl: 60000
		})
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes({ path: '/auth/current/user', method: RequestMethod.GET });
	}
}
