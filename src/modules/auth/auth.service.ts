import { Injectable, Inject, Logger, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../modules/user/entities/user.entity';
import * as crypto from 'node:crypto';
import { LoginDto } from './dto/login.dto';

import { Repository } from 'typeorm';

function md5(str: string) {
	const hash = crypto.createHash('md5');
	hash.update(str);
	return hash.digest('hex');
}

@Injectable()
export class AuthService {
	@InjectRepository(User)
	private userRepository: Repository<User>;

	@Inject(JwtService)
	private jwtService: JwtService;

	private logger = new Logger();

	async login(loginDTO: LoginDto) {
		const user = await this.userRepository.findOneBy({
			userName: loginDTO.userName
		});

		if (!user) {
			throw new HttpException(
				{
					statusCode: '-1',
					message: '用户不存在！'
				},
				200
			);
		}
		if (user.password !== md5(loginDTO.password)) {
			throw new HttpException(
				{
					statusCode: '-1',
					message: '密码错误！'
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
