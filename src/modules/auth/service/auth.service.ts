import { Injectable, Inject, Logger, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from '../dto/login.dto';
import { CaptchaService } from './captcha.service';

import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
	@InjectRepository(User)
	private userRepository: Repository<User>;

	@Inject(JwtService)
	private jwtService: JwtService;

	@Inject(CaptchaService)
	private captchaService: CaptchaService;

	async login(loginDTO: LoginDto) {
		const user = await this.userRepository.findOneBy({
			userName: loginDTO.userName
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

		if (!bcryptjs.compare(user.password, loginDTO.password)) {
			throw new HttpException(
				{
					statusCode: '-1',
					message: '密码错误'
				},
				200
			);
		}

		const { captchaId, captcha } = loginDTO;

		const result = await this.captchaService.check(captchaId, captcha);

		if (!result) {
			throw new HttpException(
				{
					statusCode: '-1',
					message: '验证码错误'
				},
				200
			);
		}

		const { id, userName } = user;
		const accessToken = this.jwtService.sign(
			{
				user: { id, userName }
			},
			{
				expiresIn: '3m'
			}
		);
		const refreshToken = this.jwtService.sign(
			{
				user: { id, userName }
			},
			{
				expiresIn: '7d'
			}
		);

		return {
			accessToken,
			refreshToken
		};
	}
}
