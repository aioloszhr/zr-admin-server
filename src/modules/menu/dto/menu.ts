import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '@/common/base.dto';
import { MenuEntity } from '../entity/menu';

export class MenuDTO extends BaseDTO<MenuEntity> {
	@ApiProperty({ description: '上级id' })
	parentId?: string;
	@ApiProperty({ description: '名称' })
	@IsNotEmpty({ message: '名称不能为空' })
	name: string;
	@ApiProperty({ description: '图标' })
	icon?: string;
	@ApiProperty({ description: '类型，1:目录 2:菜单' })
	@IsNotEmpty({ message: '类型不能为空' })
	type: number;
	@ApiProperty({ description: '路由' })
	route?: string;
	@ApiProperty({ description: '本地组件地址' })
	filePath?: string;
	@ApiProperty({ description: '排序号' })
	orderNumber?: number;
	@ApiProperty({ description: 'url' })
	url?: string;
	@ApiProperty({ description: '是否在菜单中显示' })
	show?: boolean;
}
