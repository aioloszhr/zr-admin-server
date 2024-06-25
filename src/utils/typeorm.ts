import { Repository, SelectQueryBuilder } from 'typeorm';
import * as _ from 'lodash';

export function createQueryBuilder<T>(model: Repository<T>, alias?: string): SelectQueryBuilder<T> {
	const query = model.createQueryBuilder(alias || 't');
	return query.where('1=1');
}

export function likeQueryByQueryBuilder<T>(
	queryBuilder: SelectQueryBuilder<T>,
	obj: T,
	alias?: string
): SelectQueryBuilder<T> {
	if (!obj) return queryBuilder;

	Object.keys(obj).forEach((key: string) => {
		if (!_.isNil(obj[key]) && obj[key] !== '') {
			queryBuilder = queryBuilder.andWhere(`${alias || 't'}.${key} like :${key}`, {
				[key]: like(obj[key])
			});
		}
	});

	return queryBuilder;
}

export function like(val: string): string {
	return `%${val}%`;
}
