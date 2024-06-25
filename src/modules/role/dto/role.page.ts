import { ApiProperty } from '@nestjs/swagger';
import { PageDTO } from '@/common/page.dto';
import { IsString, IsOptional } from 'class-validator';

export class RolePageDTO extends PageDTO {
	@ApiProperty({ description: '代码' })
	@IsString()
	@IsOptional()
	code?: string;
	@ApiProperty({ name: '名称' })
	@IsString()
	@IsOptional()
	name?: string;
}
