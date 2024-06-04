import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: 'localhost',
			port: 3306,
			username: 'root',
			password: 'Zhangrui@092',
			database: 'login_test',
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
				expiresIn: '7d'
			}
		}),
		UserModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
