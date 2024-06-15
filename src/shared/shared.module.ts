import { Global, Module, type Provider } from '@nestjs/common';

import { ApiConfigService } from './services/api-config.service';

const providers: Provider[] = [ApiConfigService];

@Global()
@Module({
	providers,
	exports: [...providers]
})
export class SharedModule {}
