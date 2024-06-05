import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiBody({ type: LoginDto })
	@Post('login')
	async login(@Body(ValidationPipe) loginDto: LoginDto) {
		return await this.authService.login(loginDto);
	}
}
