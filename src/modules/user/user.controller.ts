import { Controller, Post, Body, HttpStatus, Inject, ValidationPipe } from '@nestjs/common';
import { UserDTO } from './dto/user';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserVO } from './vo/user';

@ApiTags('user')
@Controller('/user')
export class UserController {
	@Inject(UserService)
	private userService: UserService;

	@ApiOperation({ description: '创建用户' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: '创建用户成功',
		type: UserVO
	})
	@ApiBody({
		type: UserDTO
	})
	@Post('/')
	async create(@Body() data: UserDTO) {
		return await this.userService.createUser(data);
	}
}
