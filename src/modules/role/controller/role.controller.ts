import { Controller, Get, Post, Body, Inject, Query, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from '../service/role.service';
import { RolePageDTO } from '../dto/role.page';
import { RoleDTO } from '../dto/role';
import { RoleMenuDTO } from '../dto/role.menu';

@ApiTags('role')
@Controller('role')
export class RoleController {
	@Inject(RoleService)
	private roleService: RoleService;

	@ApiOperation({ description: '创建角色' })
	@Post('')
	async create(@Body() data: RoleDTO) {
		return await this.roleService.createRole(data);
	}

	@ApiOperation({ description: '更新角色' })
	@Put('')
	async update(@Body() data: RoleDTO) {
		return await this.roleService.editRole(data);
	}

	@ApiOperation({ description: '分页获取角色列表' })
	@Get('page')
	async page(@Query() rolePageDTO: RolePageDTO) {
		return await this.roleService.getRoleListByPage(rolePageDTO);
	}

	@ApiOperation({ description: '根据角色id获取菜单列表' })
	@Get('menu/list')
	async getMenusByRoleId(@Query('id') id: string) {
		const menus = await this.roleService.getMenusByRoleId(id);
		return menus.map(o => o.menuId);
	}

	@ApiOperation({ description: '获取角色列表' })
	@Get('/list')
	async list() {
		return await this.roleService.list();
	}

	@ApiOperation({ description: '角色分配菜单' })
	@Post('/alloc/menu')
	async allocMenu(@Body() roleMenuDTO: RoleMenuDTO) {
		return await this.roleService.allocMenu(roleMenuDTO.roleId, roleMenuDTO.menuIds);
	}
}
