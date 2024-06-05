import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: 'localhost',
			port: 3306,
			username: 'root',
			password: 'Zhangrui@092',
			database: 'react_admin',
			synchronize: true,
			logging: true,
			entities: [User],
			poolSize: 10,
			connectorPackage: 'mysql2',
			extra: {
				authPlugin: 'sha256_password'
			}
		}),
		JwtModule.register({
			global: true,
			secret: 'aioloszhr',
			signOptions: {
				expiresIn: '30m'
			}
		}),
		UserModule,
		AuthModule
	]
})
export class AppModule {}
