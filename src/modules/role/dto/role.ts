import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '@/common/base.dto';
import { RoleEntity } from '../entities/role';

export class RoleDTO extends BaseDTO<RoleEntity> {
	@ApiProperty({ description: '名称' })
	@IsNotEmpty({ message: '名称不能为空' })
	@IsString()
	name: string;
	@ApiProperty({ description: '代码' })
	@IsNotEmpty({ message: '代码不能为空' })
	@IsString()
	code: string;
	@ApiProperty({ description: '角色对应的菜单ID' })
	@IsArray()
	menuIds?: string[];
}
