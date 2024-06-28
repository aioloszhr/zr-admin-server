import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { WebSocket } from 'ws';
// import { Socket } from 'socket.io';
import { SocketMessage } from './message';

const socketChannel = 'socket-message';

@Injectable()
export class SocketService implements OnModuleInit {
	connects = new Map<string, WebSocket[]>();
	private subscriber: Redis;
	private publisher: Redis;

	constructor(@Inject('REDIS_CLIENT') redisClient: Redis) {
		this.subscriber = redisClient.duplicate();
		this.publisher = redisClient.duplicate();
	}

	async onModuleInit() {
		await this.subscriber.subscribe(socketChannel);
		this.subscriber.on('message', (channel: string, message: string) => {
			if (channel === socketChannel && message) {
				const messageData = JSON.parse(message);
				const { userId, data } = messageData;
				const clients = this.connects.get(userId);

				if (clients?.length) {
					clients.forEach(client => {
						client.send(JSON.stringify(data));
					});
				}
			}
		});
	}

	/**
	 * 添加连接
	 * @param userId 用户id
	 * @param connect 用户socket连接
	 */
	addConnect(userId: string, connect: WebSocket) {
		const curConnects = this.connects.get(userId);
		if (curConnects) {
			curConnects.push(connect);
		} else {
			this.connects.set(userId, [connect]);
		}
	}

	/**
	 * 删除连接
	 * @param connect 用户socket连接
	 */
	deleteConnect(connect: WebSocket) {
		const connects = [...this.connects.values()];

		for (let i = 0; i < connects.length; i += 1) {
			const sockets = connects[i];
			const index = sockets.indexOf(connect);
			if (index >= 0) {
				sockets.splice(index, 1);
				break;
			}
		}
	}

	/**
	 * 给指定用户发消息
	 * @param userId 用户id
	 * @param data 数据
	 */
	sendMessage<T>(userId: string, data: SocketMessage<T>) {
		this.publisher.publish(socketChannel, JSON.stringify({ userId, data }));
	}
}
