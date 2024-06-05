import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: '用户名称' })
	@Column({ comment: '用户名称' })
	userName: string;

	@ApiProperty({ description: '密码' })
	@Column({ comment: '密码' })
	password: string;

	@ApiProperty({ description: '用户昵称' })
	@Column({ comment: '用户昵称' })
	nickName: string;

	@ApiProperty({ description: '性别' })
	@Column({ comment: '性别（0:女，1:男）', nullable: true })
	sex: number;

	@ApiPropertyOptional({ description: '手机号' })
	@Column({ comment: '手机号' })
	phoneNumber?: string;

	@ApiPropertyOptional({ description: '邮箱' })
	@Column({ comment: '邮箱' })
	email?: string;

	@ApiPropertyOptional({ description: '头像' })
	@Column({ comment: '头像', nullable: true })
	avatar?: string;

	@CreateDateColumn({ comment: '创建时间' })
	createTime: Date;

	@UpdateDateColumn({ comment: '更新时间' })
	updateTime: Date;
}
