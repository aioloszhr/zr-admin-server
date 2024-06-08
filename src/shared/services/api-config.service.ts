import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';
import { User } from '@/modules/user/entities/user.entity';

import { type TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ApiConfigService {
	constructor(private configService: ConfigService) {}

	get documentationEnabled(): boolean {
		return this.getBoolean('ENABLE_DOCUMENTATION');
	}

	get mysqlConfig(): TypeOrmModuleOptions {
		console.log('env', `${process.env.NODE_ENV}`);
		return {
			entities: [User],
			type: 'mysql',
			host: this.getString('DB_HOST'),
			port: this.getNumber('DB_PORT'),
			username: this.getString('DB_USERNAME'),
			password: this.getString('DB_PASSWORD'),
			database: this.getString('DB_DATABASE'),
			synchronize: this.getBoolean('DB_SYNCHRONIZE'),
			logging: true,
			poolSize: this.getNumber('DB_POOLSIZE'),
			connectorPackage: 'mysql2',
			extra: {
				authPlugin: 'sha256_password'
			}
		};
	}

	private getBoolean(key: string): boolean {
		const value = this.get(key);

		try {
			return Boolean(JSON.parse(value));
		} catch {
			throw new Error(key + ' environment variable is not a boolean');
		}
	}

	private getNumber(key: string): number {
		const value = this.get(key);

		try {
			return Number(value);
		} catch {
			throw new Error(key + ' environment variable is not a number');
		}
	}

	private getString(key: string): string {
		const value = this.get(key);

		return value.replaceAll('\\n', '\n');
	}

	private get(key: string): string {
		const value = this.configService.get<string>(key);

		/** 判断环境变量是否存在 */
		if (isNil(value)) {
			throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
		}

		return value;
	}
}
