import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOptionsWhere, IsNull, FindOptionsOrder } from 'typeorm';
import { MenuEntity } from '../entity/menu';
import { MenuDTO } from '../dto/menu';

@Injectable()
export class MenuService {
	@InjectRepository(MenuEntity)
	private menuRepository: Repository<MenuEntity>;
	@InjectDataSource()
	private defaultDataSource: DataSource;

	async createMenu(data: MenuDTO) {
		if (data.route && (await this.menuRepository.countBy({ route: data.route })) > 0) {
			throw new HttpException('路由不能重复', HttpStatus.BAD_REQUEST);
		}

		const entity = data.toEntity();

		await this.defaultDataSource.transaction(async manager => {
			await manager.save(MenuEntity, entity);
		});

		return { ...entity };
	}

	async editMenu(data: MenuDTO) {
		const entity = data.toEntity();

		await this.defaultDataSource.transaction(async manager => {
			await manager.save(MenuEntity, entity);
		});

		return entity;
	}

	async removeMenu(id: string) {
		await this.menuRepository
			.createQueryBuilder()
			.delete()
			.where('id = :id', { id })
			.orWhere('parentId = :id', { id })
			.execute();
	}

	async page(page: number, pageSize: number, where?: FindOptionsWhere<MenuEntity>) {
		if (where) {
			where.parentId = IsNull();
		} else {
			where = { parentId: IsNull() };
		}

		const order: FindOptionsOrder<MenuEntity> = { orderNumber: 'ASC' };

		const [data, total] = await this.menuRepository.findAndCount({
			where,
			order,
			skip: page * pageSize,
			take: pageSize
		});

		if (!data.length) return { data: [], total: 0 };

		const ids = data.map((o: MenuEntity) => o.id);
		const countMap = await this.menuRepository
			.createQueryBuilder('menu')
			.select('COUNT(menu.parentId)', 'count')
			.addSelect('menu.parentId', 'id')
			.where('menu.parentId IN (:...ids)', { ids })
			.groupBy('menu.parentId')
			.getRawMany();

		const result = data.map((item: MenuEntity) => {
			const count =
				countMap.find((o: { id: string; count: number }) => o.id === item.id)?.count || 0;

			return {
				...item,
				hasChild: Number(count) > 0
			};
		});

		return { data: result, total };
	}

	async getChildren(parentId?: string) {
		if (!parentId) {
			throw new HttpException('父节点id不能为空', HttpStatus.BAD_REQUEST);
		}
		const data = await this.menuRepository.find({
			where: { parentId: parentId },
			order: { orderNumber: 'ASC' }
		});
		if (!data.length) return [];

		const ids = data.map((o: any) => o.id);
		const countMap = await this.menuRepository
			.createQueryBuilder('menu')
			.select('COUNT(menu.parentId)', 'count')
			.addSelect('menu.parentId', 'id')
			.where('menu.parentId IN (:...ids)', { ids })
			.groupBy('menu.parentId')
			.getRawMany();

		const result = data.map((item: any) => {
			const count = countMap.find(o => o.id === item.id)?.count || 0;
			return {
				...item,
				hasChild: Number(count) > 0
			};
		});

		return result;
	}

	async list(where?: FindOptionsWhere<MenuEntity>) {
		const order: any = { createDate: 'desc' };
		const data = await this.menuRepository.find({
			where,
			order
		});
		return data;
	}
}
