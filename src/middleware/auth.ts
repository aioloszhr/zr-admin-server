import { HttpException, HttpStatus, Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	@Inject('REDIS_CLIENT')
	private redisClient: Redis;

	async use(req: Request, res: Response, next: () => void) {
		let token = req.headers['authorization']?.replace('Bearer', '') as string;
		token = token.trim();
		if (!token) {
			throw new HttpException('未授权', HttpStatus.UNAUTHORIZED);
		}

		const userInfoStr = await this.redisClient.get(`token:${token}`);
		if (!userInfoStr) {
			throw new HttpException('未授权', HttpStatus.UNAUTHORIZED);
		}

		const userInfo = JSON.parse(userInfoStr);

		req['token'] = token;
		req['userInfo'] = userInfo;

		next();
	}
}
