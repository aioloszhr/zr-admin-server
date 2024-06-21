import { ApiProperty } from '@nestjs/swagger';
import { omit } from 'lodash';
import { BaseEntity } from './base.entity';

export class BaseDTO<T extends BaseEntity> {
	@ApiProperty()
	id: string;
	toEntity() {
		return omit(this, ['createDate', 'updateDate']) as unknown as T;
	}
}
