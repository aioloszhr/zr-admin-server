import { Global, Module, type Provider } from '@nestjs/common';

import { ApiConfigService } from './services/api-config.service';
import { RsaService } from './services/rsa.service';

const providers: Provider[] = [ApiConfigService, RsaService];

@Global()
@Module({
	providers,
	exports: [...providers]
})
export class SharedModule {}
