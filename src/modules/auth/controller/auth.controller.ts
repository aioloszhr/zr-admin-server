import {
	Controller,
	Post,
	Get,
	Body,
	ValidationPipe,
	Inject,
	HttpCode,
	HttpStatus
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { CaptchaService } from '../service/captcha.service';
import { LoginDto } from '../dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	@Inject()
	private authService: AuthService;

	@Inject()
	private captchaService: CaptchaService;

	@ApiBody({ type: LoginDto })
	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Body(ValidationPipe) loginDto: LoginDto) {
		return await this.authService.login(loginDto);
	}

	@Get('captcha')
	async getImageCaptcha() {
		const { id, imageBase64 } = await this.captchaService.formula({
			height: 40,
			width: 120,
			noise: 1,
			color: true
		});
		return {
			id,
			imageBase64
		};
	}
}
