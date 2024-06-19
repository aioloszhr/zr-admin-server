import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RedisClientType } from 'redis';
import * as NodeRSA from 'node-rsa';

@Injectable()
export class RsaService {
	@Inject('REDIS_CLIENT')
	private redisClient: RedisClientType;

	async getPublicKey(): Promise<string> {
		const key = new NodeRSA({ b: 512 });
		const publicKey = key.exportKey('public'); // 获取公钥
		const privateKey = key.exportKey('private'); // 获取私钥
		await this.redisClient.set(`publicKey:${publicKey}`, privateKey);
		return publicKey;
	}

	async decrypt(publicKey: string, data: string) {
		const privateKey = await this.redisClient.get(`publicKey:${publicKey}`);

		await this.redisClient.del(`publicKey:${publicKey}`);

		if (!privateKey) {
			throw new HttpException('解密私钥错误或已失效', HttpStatus.BAD_REQUEST);
		}

		const decrypt = new NodeRSA(privateKey);
		decrypt.setOptions({ encryptionScheme: 'pkcs1', environment: 'browser' });
		return decrypt.decrypt(data, 'utf8');
	}
}
