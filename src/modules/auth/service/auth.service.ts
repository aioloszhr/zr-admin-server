import { Injectable, Inject, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { LoginDTO } from '../dto/login';
import { CaptchaService } from './captcha.service';
import { ApiConfigService } from '@/shared/services/api-config.service';
import { uuid } from '@/utils/uuid';
import { RefreshTokenDTO } from '../dto/refresh.token';
import { RedisClientType } from 'redis';
import { UserEntity } from '@/modules/user/entities/user';
import { UserRoleEntity } from '@/modules/user/entities/user.role';
import { RoleEntity } from '@/modules/role/entities/role';

@Injectable()
export class AuthService {
	@InjectRepository(UserEntity)
	private userRepository: Repository<UserEntity>;

	@Inject(CaptchaService)
	private captchaService: CaptchaService;

	@Inject('REDIS_CLIENT')
	private redisClient: RedisClientType;

	@Inject(ApiConfigService)
	private apiConfigService: ApiConfigService;

	async login(loginDTO: LoginDTO) {
		const user = await this.userRepository.findOneBy({
			userName: loginDTO.userName
		});

		if (!user) {
			throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
		}

		if (!bcryptjs.compare(user.password, loginDTO.password)) {
			throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
		}

		const { id } = user;

		const { expire, refreshExpire } = this.apiConfigService.redisConfig;

		const token = uuid();
		const refreshToken = uuid();

		// multi可以实现redis指令并发执行
		await this.redisClient
			.multi()
			.set(`token:${token}`, JSON.stringify({ userId: id, refreshToken }))
			.expire(`token:${token}`, expire)
			.set(`refreshToken:${refreshToken}`, user.id)
			.expire(`refreshToken:${refreshToken}`, refreshExpire)
			.exec();

		const { captchaId, captcha } = loginDTO;

		const result = await this.captchaService.check(captchaId, captcha);

		if (!result) {
			throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
		}

		return {
			expire,
			refreshExpire,
			token,
			refreshToken
		};
	}

	async refreshToken(refreshTokenDto: RefreshTokenDTO) {
		const userId = await this.redisClient.get(`refreshToken:${refreshTokenDto.refreshToken}`);

		if (!userId) {
			throw new HttpException('用户凭证已过期，请重新登录！', HttpStatus.UNAUTHORIZED);
		}

		const { expire } = this.apiConfigService.redisConfig;

		const token = uuid();

		await this.redisClient
			.multi()
			.set(`token:${token}`, JSON.stringify({ userId, refreshTokenDto }))
			.expire(`token:${token}`, expire)
			.exec();

		// TTL（Time to Live）是指键的剩余存活时间
		const refreshExpire = await this.redisClient.ttl(
			`refreshToken:${refreshTokenDto.refreshToken}`
		);

		return {
			expire,
			token,
			refreshExpire,
			refreshToken: refreshTokenDto.refreshToken
		};
	}

	async getUserById(userId: string) {
		const entity = await this.userRepository
			.createQueryBuilder('t')
			.leftJoinAndSelect(UserRoleEntity, 'user_role', 't.id = user_role.userId')
			.leftJoinAndMapMany('t.roles', RoleEntity, 'role', 'role.id = user_role.roleId')
			.where('t.id = :id', { id: userId })
			.getOne();

		if (!entity) {
			throw new HttpException('当前用户不存在！', HttpStatus.BAD_REQUEST);
		}
		return entity;
	}
}
