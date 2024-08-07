import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';
import { EverythingSubscriber } from '@/typeorm-event-subscriber';

import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type {
	CaptchaOptions,
	RedisOptions,
	AiOptions,
	SerpApiOptions,
	TongyiApiOptions
} from '@/types';

@Injectable()
export class ApiConfigService {
	constructor(private configService: ConfigService) {}

	private getBoolean(key: string): boolean {
		const value = this.get(key);

		try {
			return Boolean(JSON.parse(value));
		} catch {
			throw new Error(key + ' env variable is not a boolean');
		}
	}

	private getNumber(key: string): number {
		const value = this.get(key);

		try {
			return Number(value);
		} catch {
			throw new Error(key + ' env variable is not a number');
		}
	}

	private getString(key: string): string {
		const value = this.get(key);

		return value.replaceAll('\\n', '\n');
	}

	get documentationEnabled(): boolean {
		return this.getBoolean('ENABLE_DOCUMENTATION');
	}

	get mysqlConfig(): TypeOrmModuleOptions {
		return {
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
			},
			// 自动引入Entity实体类
			autoLoadEntities: true,
			subscribers: [EverythingSubscriber]
		};
	}

	get captchaConfig(): CaptchaOptions {
		return {
			expirationTime: this.getNumber('CAPTCHA_EXPIRATIONTIME'),
			idPrefix: this.getString('CAPTCHA_IDPREFIX')
		};
	}

	get redisConfig(): RedisOptions {
		return {
			host: this.getString('REDIS_HOST'),
			port: this.getNumber('REDIS_PORT'),
			expire: this.getNumber('REDIS_EXPIRE'),
			refreshExpire: this.getNumber('REDIS_REFRESH_EXPIRE')
		};
	}

	get aiConfig(): AiOptions {
		return {
			apiKey: this.getString('API_KEY'),
			modelName: this.getString('MODEL_NAME'),
			baseUrl: this.getString('BASE_URL')
		};
	}

	get serpApiConfig(): SerpApiOptions {
		return {
			apiKey: this.getString('SERP_API')
		};
	}

	get tongyiApiConfig(): TongyiApiOptions {
		return {
			apiKey: this.getString('TONGYI_API')
		};
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
