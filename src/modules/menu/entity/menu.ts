import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@/common/base.entity';

@Entity('sys_menu')
export class MenuEntity extends BaseEntity {
	@ApiProperty({ description: '上级id' })
	@Column({ comment: '上级id', nullable: true })
	parentId?: string;
	@ApiProperty({ description: '名称' })
	@Column({ comment: '名称' })
	name?: string;
	@ApiProperty({ description: '图标' })
	@Column({ comment: '图标', nullable: true })
	icon?: string;
	@ApiProperty({ description: '类型，1:目录 2:菜单' })
	@Column({ comment: '类型，1:目录 2:菜单' })
	type?: number;
	@ApiProperty({ description: '路由' })
	@Column({ comment: '路由' })
	route?: string;
	@ApiProperty({ description: '本地组件地址' })
	@Column({ comment: '本地组件地址', nullable: true })
	filePath?: string;
	@ApiProperty({ description: '排序号' })
	@Column({ comment: '排序号' })
	orderNumber?: number;
	@ApiProperty({ description: 'url' })
	@Column({ comment: 'url', nullable: true })
	url?: string;
	@ApiProperty({ description: '是否在菜单中显示' })
	@Column({ comment: '是否在菜单中显示' })
	show?: boolean;
}
