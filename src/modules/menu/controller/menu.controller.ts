import { Controller, Inject, Body, Post, HttpStatus, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuService } from '../service/menu.service';
import { MenuDTO } from '../dto/menu';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
	@Inject(MenuService)
	private menuService: MenuService;

	@ApiOperation({ description: '创建一个菜单' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: '创建用户成功'
	})
	@ApiBody({
		type: MenuDTO
	})
	@Post('')
	async create(@Body() data: MenuDTO) {
		return await this.menuService.createMenu(data);
	}

	@ApiOperation({ description: '分页查询菜单' })
	@Get('page')
	async page(@Query('page') page: number, @Query('size') size: number) {
		return await this.menuService.page(page, size);
	}
}
