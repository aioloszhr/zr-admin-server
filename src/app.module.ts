import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MenuModule } from './modules/menu/menu.module';
import { RoleModule } from './modules/role/role.module';
import { SocketModule } from './modules/socket/socket.module';
import { LangchainChatModule } from './modules/langchain-chat/langchain-chat.module';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { AuthMiddleware } from './middleware/auth';
import { RedisModule } from './redis/redis.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
	imports: [
		AuthModule,
		UserModule,
		MenuModule,
		RoleModule,
		SocketModule,
		LangchainChatModule,
		/** 注册redis */
		RedisModule,
		/** 注册openai服务 */
		OpenaiModule,
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
