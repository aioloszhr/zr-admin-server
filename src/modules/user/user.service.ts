import { Injectable, HttpException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { UserVO } from './vo/user.vo';
import { omit } from 'lodash';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
	@InjectRepository(User)
	private userRepository: Repository<User>;

	async createUser(entity: UserDto): Promise<UserVO> {
		const { userName, password, phoneNumber, email } = entity;

		let isExist = (await this.userRepository.countBy({ userName })) > 0;

		if (isExist) {
			throw new HttpException(
				{
					statusCode: '-1',
					message: '当前用户名已存在'
				},
				200
			);
		}

		isExist = (await this.userRepository.countBy({ phoneNumber })) > 0;

		if (isExist) {
			throw new HttpException(
				{
					statusCode: '-1',
					message: '当前手机号已存在'
				},
				200
			);
		}

		isExist = (await this.userRepository.countBy({ email })) > 0;

		if (isExist) {
			throw new HttpException(
				{
					statusCode: '-1',
					message: '当前邮箱已存在'
				},
				200
			);
		}

		/**
		 * 	密码加密加盐处理
		 * 	@description 即使password，最终也会生成不同的密码
		 */
		entity.password = bcryptjs.hashSync(password, 10);

		await this.userRepository.save(entity);

		return omit(entity, ['password']) as UserVO;
	}
}
