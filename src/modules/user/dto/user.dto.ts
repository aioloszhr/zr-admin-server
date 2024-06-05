import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsEmail, Length, IsString } from 'class-validator';

export class UserDto {
	@ApiProperty({ description: '用户名称' })
	@IsString()
	@IsNotEmpty({ message: '用户名称不能为空' })
	userName: string;

	@ApiProperty({ description: '密码' })
	@IsString()
	@IsNotEmpty({ message: '密码不能为空' })
	@Length(6, 30)
	password: string;

	@ApiProperty({ description: '用户昵称' })
	@IsString()
	@IsNotEmpty({ message: '用户昵称不能为空' })
	nickName: string;

	@ApiPropertyOptional({ description: '性别（0:女，1:男）' })
	sex: number;

	@ApiPropertyOptional({ description: '电话号码' })
	@IsString()
	@IsPhoneNumber('CN')
	phoneNumber?: string;

	@ApiPropertyOptional({ description: '邮箱' })
	@IsString()
	@IsEmail()
	email?: string;

	@ApiPropertyOptional({ description: '头像' })
	avatar?: string;
}
