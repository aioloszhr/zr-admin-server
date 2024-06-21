import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { UserEntity } from './entities/user';
import { UserDTO } from './dto/user';
import { UserVO } from './vo/user';

@Injectable()
export class UserService {
	@InjectRepository(UserEntity)
	private userRepository: Repository<UserEntity>;

	async createUser(userDTO: UserDTO): Promise<UserVO> {
		const entity = userDTO.toEntity();
		const { userName, phoneNumber, email } = entity;

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

		// 随机生成一个密码
		// const password = uuid();

		// 密码加密加盐处理, 即使password，最终也会生成不同的密码。
		const hashPassword = bcryptjs.hashSync('123456', 10);

		entity.password = hashPassword;

		await this.userRepository.save(entity);

		// 把entity中的password移除返回给前端
		return omit(entity, ['password']) as UserVO;
	}
}
