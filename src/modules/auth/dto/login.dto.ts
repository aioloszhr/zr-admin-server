import { ApiProperty, ApiOperation } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
	@ApiProperty({ description: '用户名称' })
	@IsNotEmpty()
	userName: string;
	@ApiProperty({ description: '密码' })
	@IsNotEmpty()
	password: string;
}
