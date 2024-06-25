import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { createQueryBuilder, likeQueryByQueryBuilder } from '@/utils/typeorm';
import { RolePageDTO } from '../dto/role.page';
import { RoleEntity } from '../entities/role';
import { RoleDTO } from '../dto/role';
import { RoleMenuEntity } from '../entities/role.menu';

@Injectable()
export class RoleService {
	@InjectRepository(RoleEntity)
	private roleModel: Repository<RoleEntity>;
	@InjectRepository(RoleMenuEntity)
	private roleMenuModel: Repository<RoleMenuEntity>;
	@InjectDataSource()
	private defaultDataSource: DataSource;

	async getRoleListByPage(rolePageDTO: RolePageDTO) {
		const { name, code, page, size } = rolePageDTO;
		let queryBuilder = createQueryBuilder<RoleEntity>(this.roleModel);
		queryBuilder = likeQueryByQueryBuilder(queryBuilder, {
			code,
			name
		});

		const [data, total] = await queryBuilder
			.orderBy('createDate', 'DESC')
			.skip(page * size)
			.take(size)
			.getManyAndCount();

		return {
			total,
			data
		};
	}

	async createRole(data: RoleDTO) {
		if ((await this.roleModel.countBy({ code: data.code })) > 0) {
			throw new HttpException('代码不能重复', HttpStatus.BAD_REQUEST);
		}
		this.defaultDataSource.transaction(async manager => {
			const entity = data.toEntity();
			await manager.save(RoleEntity, entity);
			const roleMenus = data.menuIds.map(menuId => {
				const roleMenu = new RoleMenuEntity();
				roleMenu.menuId = menuId;
				roleMenu.roleId = entity.id;
				return roleMenu;
			});

			if (roleMenus.length) {
				// 批量插入
				await manager
					.createQueryBuilder()
					.insert()
					.into(RoleMenuEntity)
					.values(roleMenus)
					.execute();
			}
		});
	}

	async editRole(data: RoleDTO) {
		await this.defaultDataSource.transaction(async manager => {
			const entity = data.toEntity();
			await manager.save(RoleEntity, entity);
			if (Array.isArray(data.menuIds)) {
				const roleMenus = await this.roleMenuModel.findBy({ roleId: data.id });

				await manager.delete(RoleMenuEntity, roleMenus);

				if (data.menuIds.length) {
					// 批量插入
					await manager
						.createQueryBuilder()
						.insert()
						.into(RoleMenuEntity)
						.values(
							data.menuIds.map(menuId => {
								const roleMenu = new RoleMenuEntity();
								roleMenu.menuId = menuId;
								roleMenu.roleId = entity.id;
								return roleMenu;
							})
						)
						.execute();

					const oldMenuIds = roleMenus.map(menu => menu.menuId);
				}
			}
		});
	}

	async getMenusByRoleId(roleId: string) {
		const curRoleMenus = await this.roleMenuModel.find({
			where: { roleId: roleId }
		});
		return curRoleMenus;
	}

	async list() {
		const order: any = { createDate: 'desc' };
		const data = await this.roleModel.find({
			order
		});

		return data;
	}

	async allocMenu(roleId: string, menuIds: string[]) {
		const curRoleMenus = await this.roleMenuModel.findBy({
			roleId
		});

		const roleMenus = [];
		menuIds.forEach((menuId: string) => {
			const roleMenu = new RoleMenuEntity();
			roleMenu.menuId = menuId;
			roleMenu.roleId = roleId;
			roleMenus.push(roleMenu);
		});

		await this.defaultDataSource.transaction(async manager => {
			await manager.remove(RoleMenuEntity, curRoleMenus);
			await manager.save(RoleMenuEntity, roleMenus);
		});
	}
}
