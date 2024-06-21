import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDTO {
	@ApiProperty({ description: '刷新token' })
	refreshToken?: string;
}
