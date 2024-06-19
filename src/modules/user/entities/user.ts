import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/base.entity';
import { RoleEntity } from '@/modules/role/entities/role';

@Entity('sys_user')
export class UserEntity extends BaseEntity {
	@ApiProperty({ description: '用户名称' })
	@Column({ comment: '用户名称' })
	userName: string;

	@ApiProperty({ description: '用户昵称' })
	@Column({ comment: '用户昵称' })
	nickName: string;

	@ApiProperty({ description: '手机号' })
	@Column({ comment: '手机号' })
	phoneNumber: string;

	@ApiProperty({ description: '邮箱' })
	@Column({ comment: '邮箱' })
	email: string;

	@ApiProperty({ description: '头像' })
	@Column({ comment: '头像', nullable: true })
	avatar?: string;

	@ApiProperty({ description: '性别' })
	@Column({ comment: '性别（0:女，1:男）', nullable: true })
	sex?: number;

	@ApiProperty({ description: '密码' })
	@Column({ comment: '密码' })
	password: string;

	roles: RoleEntity[];
}
