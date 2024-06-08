import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';

@Module({
	imports: [
		AuthModule,
		UserModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [`.env.${process.env.NODE_ENV}`]
		}),
		JwtModule.register({
			global: true,
			secret: 'aioloszhr',
			signOptions: {
				expiresIn: '30m'
			}
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
export class AppModule {}
