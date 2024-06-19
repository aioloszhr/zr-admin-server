import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sys_user_role')
export class UserRoleEntity extends BaseEntity {
	@ApiProperty({ description: '用户id' })
	@Column({ comment: '用户id' })
	userId?: string;
	@ApiProperty({ description: '角色id' })
	@Column({ comment: '角色id' })
	roleId?: string;
}
