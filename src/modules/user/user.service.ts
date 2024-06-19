import { Injectable, HttpException, Inject, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user';
import { UserDto } from './dto/user.dto';
import { UserVO } from './vo/user.vo';
import { omit } from 'lodash';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
	@InjectRepository(UserEntity)
	private userRepository: Repository<UserEntity>;

	async createUser(entity: UserDto): Promise<UserVO> {
		const { userName, password, phoneNumber, email } = entity;

		let isExist = (await this.userRepository.countBy({ userName })) > 0;

		if (isExist) {
			throw new HttpException('当前用户名已存在', HttpStatus.BAD_REQUEST);
		}

		isExist = (await this.userRepository.countBy({ phoneNumber })) > 0;

		if (isExist) {
			throw new HttpException('当前手机号已存在', HttpStatus.BAD_REQUEST);
		}

		isExist = (await this.userRepository.countBy({ email })) > 0;

		if (isExist) {
			throw new HttpException('当前邮箱已存在', HttpStatus.BAD_REQUEST);
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
