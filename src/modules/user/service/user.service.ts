import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { UserEntity } from '../entities/user';
import { UserDTO } from '../dto/user';
import { UserVO } from '../vo/user';
import { UserRoleEntity } from '../entities/user.role';
import { RoleEntity } from '@/modules/role/entities/role';
import { RedisClientType } from 'redis';

@Injectable()
export class UserService {
	@InjectRepository(UserEntity)
	private userRepository: Repository<UserEntity>;
	@InjectRepository(UserRoleEntity)
	private userRoleRepository: Repository<UserRoleEntity>;
	@InjectDataSource()
	private defaultDataSource: DataSource;
	@Inject('REDIS_CLIENT')
	private redisClient: RedisClientType;

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

		// 使用事务
		await this.defaultDataSource.transaction(async manager => {
			await manager.save(UserEntity, entity);

			await manager.save(
				UserRoleEntity,
				userDTO.roleIds.map(roleId => {
					const userRole = new UserRoleEntity();
					userRole.roleId = roleId;
					userRole.userId = entity.id;
					return userRole;
				})
			);
		});

		// 把entity中的password移除返回给前端
		return omit(entity, ['password']) as UserVO;
	}

	async editUser(userDTO: UserDTO): Promise<void | UserVO> {
		const { userName, phoneNumber, email, id, nickName, sex, avatar } = userDTO;
		let user = await this.userRepository.findOneBy({ userName });

		if (user && user.id !== id) {
			throw new HttpException('当前用户名已存在', HttpStatus.BAD_REQUEST);
		}

		user = await this.userRepository.findOneBy({ phoneNumber });

		if (user && user.id !== id) {
			throw new HttpException('当前手机号已存在', HttpStatus.BAD_REQUEST);
		}

		user = await this.userRepository.findOneBy({ email });

		if (user && user.id !== id) {
			throw new HttpException('当前邮箱已存在', HttpStatus.BAD_REQUEST);
		}

		const userRolesMap = await this.userRoleRepository.findBy({
			userId: userDTO.id
		});

		await this.defaultDataSource.transaction(async manager => {
			Promise.all([
				manager
					.createQueryBuilder()
					.update(UserEntity)
					.set({
						nickName,
						phoneNumber,
						sex
					})
					.where('id = :id', { id: userDTO.id })
					.execute(),
				manager.remove(UserRoleEntity, userRolesMap),
				manager.save(
					UserRoleEntity,
					userDTO.roleIds.map(roleId => {
						const userRole = new UserRoleEntity();
						userRole.roleId = roleId;
						userRole.userId = userDTO.id;
						return userRole;
					})
				)
			]);
		});

		const entity = this.userRepository.findOneBy({ id });
		return omit(entity, ['password']) as UserVO;
	}

	async page<T>(page = 0, pageSize = 10, where?: FindOptionsWhere<T>) {
		const [data, total] = await this.userRepository
			.createQueryBuilder('t')
			.leftJoinAndSelect(UserRoleEntity, 'user_role', 't.id = user_role.userId')
			.leftJoinAndMapMany('t.roles', RoleEntity, 'role', 'role.id = user_role.roleId')
			.where(where)
			.skip(page * pageSize)
			.take(pageSize)
			.orderBy('t.createDate', 'DESC')
			.getManyAndCount();

		return {
			data: data.map(entity => entity.toVO()),
			total
		};
	}

	async removeUser(id: number) {
		await this.defaultDataSource.transaction(async manager => {
			const tokens = await this.redisClient.sMembers(`userToken_${id}`);
			const refreshTokens = await this.redisClient.sMembers(`userRefreshToken_${id}`);

			await Promise.all([
				manager
					.createQueryBuilder()
					.delete()
					.from(UserEntity)
					.where('id = :id', { id })
					.execute(),

				...tokens.map(token => this.redisClient.del(`token:${token}`)),
				...refreshTokens.map(refreshToken =>
					this.redisClient.del(`refreshToken:${refreshToken}`)
				)
			]);
		});
	}
}
