import { Injectable, Inject, Logger, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { RedisService } from '@/modules/redis/service/redis.service';
import { User } from '../../user/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { CaptchaService } from './captcha.service';
import { ApiConfigService } from '@/shared/services/api-config.service';
import { uuid } from '@/utils/uuid';

@Injectable()
export class AuthService {
	@InjectRepository(User)
	private userRepository: Repository<User>;

	@Inject(CaptchaService)
	private captchaService: CaptchaService;

	@Inject(RedisService)
	private redisService: RedisService;

	@Inject(ApiConfigService)
	private apiConfigService: ApiConfigService;

	async login(loginDto: LoginDto) {
		const user = await this.userRepository.findOneBy({
			userName: loginDto.userName
		});

		if (!user) {
			throw new HttpException(
				{
					statusCode: '-1',
					message: '用户不存在'
				},
				200
			);
		}

		if (!bcryptjs.compare(user.password, loginDto.password)) {
			throw new HttpException(
				{
					statusCode: '-1',
					message: '密码错误'
				},
				200
			);
		}

		const { id } = user;

		const { expire, refreshExpire } = this.apiConfigService.redisConfig;

		const token = uuid();
		const refreshToken = uuid();

		await this.redisService.zToken({ id, token, refreshToken, expire, refreshExpire });

		return {
			expire,
			refreshExpire,
			token,
			refreshToken
		};
	}
}
