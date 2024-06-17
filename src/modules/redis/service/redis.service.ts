import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
	@Inject('REDIS_CLIENT')
	private redisClient: RedisClientType;

	/** 设置token和refreshToken到redis中 */
	async zToken({ id, token, refreshToken, expire, refreshExpire }) {
		this.redisClient
			.multi()
			.set(`token:${token}`, id)
			.expire(`token:${token}`, expire)
			.set(`refreshToken:${refreshToken}`, id)
			.expire(`refreshToken:${refreshToken}`, refreshExpire)
			.exec();
	}
}
