import {
	Controller,
	Post,
	Body,
	HttpStatus,
	Inject,
	Delete,
	Get,
	Query,
	Put,
	Param
} from '@nestjs/common';
import { UserDTO } from '../dto/user';
import { UserService } from '../service/user.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserVO } from '../vo/user';
import { FindOptionsWhere, Like } from 'typeorm';
import { UserEntity } from '../entities/user';

@ApiTags('user')
@Controller('user')
export class UserController {
	@Inject(UserService)
	private userService: UserService;

	@ApiOperation({ description: '创建用户' })
	@Post('')
	async create(@Body() data: UserDTO) {
		return await this.userService.createUser(data);
	}

	@ApiOperation({ description: '编辑用户' })
	@Put('')
	async edit(@Body() data: UserDTO) {
		return await this.userService.editUser(data);
	}

	@ApiOperation({ description: '删除用户' })
	@Delete(':id')
	async remove(
		@Param('id')
		id: number
	) {
		await this.userService.removeUser(id);
	}

	@ApiOperation({ description: '分页查询' })
	@Get('page')
	async page(
		@Query('page') page: number,
		@Query('size') size: number,
		@Query('nickName') nickName: string,
		@Query('phoneNumber') phoneNumber: string
	) {
		const query: FindOptionsWhere<UserEntity> = {};

		if (nickName) {
			query.nickName = Like(`%${nickName}`);
		}

		if (phoneNumber) {
			query.phoneNumber = Like(`%${phoneNumber}`);
		}

		return await this.userService.page(page, size, query);
	}
}
