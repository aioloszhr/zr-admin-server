import {
	Controller,
	Post,
	Get,
	Body,
	ValidationPipe,
	Inject,
	HttpCode,
	HttpStatus,
	HttpException,
	Req
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { CaptchaService } from '../service/captcha.service';
import { RsaService } from '@/shared/services/rsa.service';
import { LoginDTO } from '../dto/login';
import { RefreshTokenDTO } from '../dto/refresh.token';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	@Inject(AuthService)
	private authService: AuthService;

	@Inject(CaptchaService)
	private captchaService: CaptchaService;

	@Inject(RsaService)
	private rsaService: RsaService;

	@ApiOperation({ description: '登陆' })
	@Post('login')
	async login(@Body(ValidationPipe) loginDTO: LoginDTO) {
		const password = await this.rsaService.decrypt(loginDTO.publicKey, loginDTO.password);

		if (!password) {
			throw new HttpException('登录出现异常，请重新登录', HttpStatus.BAD_REQUEST);
		}

		return await this.authService.login(loginDTO);
	}

	@ApiOperation({ description: '退出登录' })
	@Post('/logout')
	async logout(@Req() req: Request) {
		return await this.authService.logout(req);
	}

	@Post('refresh/token')
	async refreshToken(refreshTokenDTO: RefreshTokenDTO) {
		if (!refreshTokenDTO.refreshToken) {
			throw new HttpException('用户凭证已过期，请重新登录！', HttpStatus.UNAUTHORIZED);
		}
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

	@Get('publicKey')
	async getPublicKey() {
		return await this.rsaService.getPublicKey();
	}

	@Get('current/user')
	async getCurrentUser(@Req() req: Request) {
		const userId = req['userInfo']?.userId;
		return await this.authService.getUserById(userId);
	}
}
