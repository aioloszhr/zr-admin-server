import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserVO } from './vo/user.vo';

@ApiTags('user')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ description: '创建用户' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: '创建用户成功',
		type: UserVO
	})
	@ApiBody({
		type: UserDto
	})
	@Post('')
	async create(@Body() data: UserDto) {
		return await this.userService.createUser(data);
	}
}