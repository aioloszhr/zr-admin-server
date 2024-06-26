import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as svgCaptcha from 'svg-captcha';
import * as svgBase64 from 'mini-svg-data-uri';
import { uuid } from '@/utils/uuid';
import { ApiConfigService } from '@/shared/services/api-config.service';

import type { Cache } from 'cache-manager';
import type { FormulaCaptchaOptions } from '@/types';

@Injectable()
export class CaptchaService {
	@Inject(CACHE_MANAGER)
	private cacheManager: Cache;

	@Inject(ApiConfigService)
	private apiConfig: ApiConfigService;

	async formula(options?: FormulaCaptchaOptions) {
		const { data, text } = svgCaptcha.createMathExpr(options);
		const id = await this.set(text);
		const imageBase64 = svgBase64(data);
		return { id, imageBase64 };
	}

	async set(text: string): Promise<string> {
		const id = uuid();
		await this.cacheManager.set(this.getStoreId(id), (text || '').toLowerCase());
		return id;
	}

	async check(id: string, value: string): Promise<boolean> {
		if (!id || !value) {
			return false;
		}
		const storeId = this.getStoreId(id);
		const storedValue = await this.cacheManager.get(storeId);
		if (value.toLowerCase() !== storedValue) {
			return false;
		}
		this.cacheManager.del(storeId);
		return true;
	}

	private getStoreId(id: string): string {
		if (!this.apiConfig.captchaConfig.idPrefix) {
			return id;
		}
		return `${this.apiConfig.captchaConfig.idPrefix}:${id}`;
	}
}
