import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
	@PrimaryGeneratedColumn()
	id?: string;
	@CreateDateColumn({ comment: '创建时间' })
	createDate?: Date;
	@UpdateDateColumn({ comment: '更新时间' })
	updateDate?: Date;
	toVO?(): any {
		return this;
	}
}
