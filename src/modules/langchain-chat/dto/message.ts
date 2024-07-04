import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDTO {
	@ApiProperty({ description: '输入内容' })
	@IsNotEmpty()
	@IsString()
	user_query: string;
}
