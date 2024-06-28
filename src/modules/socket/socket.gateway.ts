import { Inject } from '@nestjs/common';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
// import { Socket, Server } from 'socket.io';
import * as http from 'http';
import { Redis } from 'ioredis';
import { SocketService } from './socket.service';
import { SocketMessageType, SocketMessage } from './message';
import { WebSocket, Server } from 'ws';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	@Inject('REDIS_CLIENT')
	private redisClient: Redis;
	@Inject(SocketService)
	private socketService: SocketService;

	async handleConnection(client: WebSocket, request: http.IncomingMessage) {
		// 获取url上token参数
		const token = new URLSearchParams(request.url.split('?').pop()).get('token');

		if (!token) {
			client.close();
			return;
		}

		const userInfoStr = await this.redisClient.get(`token:${token}`);
		if (!userInfoStr) {
			client.send(
				JSON.stringify({
					type: SocketMessageType.TokenExpire
				})
			);
			client.close();
			return;
		}

		const userInfo = JSON.parse(userInfoStr);
		this.socketService.addConnect(userInfo.userId, client);
	}

	@SubscribeMessage('message')
	async handleMessage(data: Buffer) {
		// 接受前端发送过来的消息
		try {
			const message = JSON.parse(data.toString()) as SocketMessage;
			// 如果前端发送过来的消息时ping，那么就返回pong给前端
			if (message.type === SocketMessageType.Ping) {
				return {
					type: SocketMessageType.Pong
				};
			}
		} catch {
			console.error('json parse error');
		}
	}

	async handleDisconnect(client: WebSocket) {
		this.socketService.deleteConnect(client);
	}
}
