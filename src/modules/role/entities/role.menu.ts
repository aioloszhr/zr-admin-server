import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';

@Entity('sys_role_menu')
export class RoleMenuEntity extends BaseEntity {
	@ApiProperty({ description: '角色id' })
	@Column({ comment: '角色id' })
	roleId?: string;
	@ApiProperty({ description: '菜单id' })
	@Column({ comment: '菜单id' })
	menuId?: string;
}
