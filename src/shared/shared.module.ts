import { Global, Module, type Provider } from '@nestjs/common';

import { ApiConfigService } from './services/api-config.service';
import { CaptchaConfigService } from './services/captcha-config.service';

const providers: Provider[] = [ApiConfigService, CaptchaConfigService];

@Global()
@Module({
	providers,
	exports: [...providers]
})
export class SharedModule {}
