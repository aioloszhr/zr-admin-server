import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsString } from 'class-validator';

export class RoleMenuDTO {
	@ApiProperty({ description: '角色id' })
	@IsNotEmpty({ message: '角色id不能为空' })
	@IsString()
	roleId?: string;
	@ApiProperty({ name: '菜单id' })
	@IsArray()
	menuIds?: string[];
}
