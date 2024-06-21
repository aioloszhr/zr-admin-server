import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsEmail, IsString } from 'class-validator';
import { BaseDTO } from '@/common/base.dto';
import { UserEntity } from '../entities/user';

export class UserDTO extends BaseDTO<UserEntity> {
	@ApiProperty({ description: '用户名称' })
	@IsString()
	@IsNotEmpty({ message: '用户名称不能为空' })
	userName: string;

	@ApiProperty({ description: '用户昵称' })
	@IsNotEmpty({ message: '用户昵称不能为空' })
	nickName: string;

	@ApiProperty({ description: '电话号码' })
	@IsPhoneNumber('CN', { message: '无效的手机号格式！' })
	phoneNumber: string;

	@ApiProperty({ description: '邮箱' })
	@IsEmail({}, { message: '无效的邮箱格式！' })
	email: string;

	@ApiProperty({ description: '头像', nullable: true })
	avatar?: string;

	@ApiProperty({ description: '性别（0:女，1:男）', nullable: true })
	sex?: number;
}
