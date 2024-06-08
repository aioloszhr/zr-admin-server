import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { type CaptchaOptions } from '@/modules/auth/interface';

@Injectable()
export class CaptchaConfigService {
	constructor(private configService: ConfigService) {}

	get captchaConfig(): CaptchaOptions {
		return {
			expirationTime: 3600,
			idPrefix: 'captcha'
		};
	}
}
