import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsInt } from 'class-validator';

export class PageDTO {
	@ApiProperty({ description: '页数', example: '0' })
	@IsNotEmpty({ message: '页数不能为空' })
	page: number;
	@ApiProperty({ description: '每页数量', example: '0' })
	@IsNotEmpty({ message: '每页数量不能为空' })
	size: number;
}
