import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('sss')
	getHello(): string {
		return 'Hello World!';
	}

	@Get('aaa')
	@UseGuards(LoginGuard)
	aaa() {
		return 'aaa';
	}

	@Get('bbb')
	@UseGuards(LoginGuard)
	bbb() {
		return 'bbb';
	}
}
