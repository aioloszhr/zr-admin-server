import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
	@ApiProperty({ description: '刷新token' })
	refreshToken?: string;
}
