import {
	Controller,
	Inject,
	Body,
	Post,
	HttpStatus,
	Get,
	Query,
	Put,
	Delete,
	Param,
	HttpException
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuService } from '../service/menu.service';
import { MenuDTO } from '../dto/menu';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
	@Inject(MenuService)
	private menuService: MenuService;

	@ApiOperation({ description: '创建菜单' })
	@Post('')
	async create(@Body() data: MenuDTO) {
		return await this.menuService.createMenu(data);
	}

	@ApiOperation({ description: '更新菜单' })
	@Put('')
	async update(@Body() data: MenuDTO) {
		return await this.menuService.editMenu(data);
	}

	@ApiOperation({ description: '删除菜单' })
	@Delete('/:id')
	async remove(
		@Param('id')
		id: string
	) {
		if (!id) {
			throw new HttpException('id不能为空', HttpStatus.BAD_REQUEST);
		}
		return await this.menuService.removeMenu(id);
	}

	@ApiOperation({ description: '分页查询菜单' })
	@Get('page')
	async page(@Query('page') page: number, @Query('size') size: number) {
		return await this.menuService.page(page, size);
	}

	@ApiOperation({ description: '根据上级菜单查询子级菜单' })
	@Get('children')
	async children(@Query('parentId') parentId: string) {
		return await this.menuService.getChildren(parentId);
	}

	@ApiOperation({ description: '查询全量菜单' })
	@Get('list')
	async list() {
		return await this.menuService.list();
	}
}
