import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDTO {
	@ApiProperty({ description: '用户名称' })
	@IsNotEmpty()
	userName: string;
	@ApiProperty({ description: '公钥' })
	@IsNotEmpty()
	publicKey: string;
	@ApiProperty({ description: '密码' })
	@IsNotEmpty()
	password: string;
	@IsNotEmpty()
	captchaId: string;
	@ApiProperty({ description: '验证码' })
	@IsNotEmpty()
	captcha: string;
}
