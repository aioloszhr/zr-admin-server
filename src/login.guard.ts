import { JwtService } from '@nestjs/jwt';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Inject,
	UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';

import type { Request } from 'express';

@Injectable()
export class LoginGuard implements CanActivate {
	@Inject(JwtService)
	private jwtService: JwtService;

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const authorization = request.header('authorization') || '';

		if (!authorization) {
			throw new UnauthorizedException('用户未登录！');
		}

		const bearer = authorization.split(' ');
		if (!bearer || bearer.length < 2) {
			throw new UnauthorizedException('登录 token 错误！');
		}

		try {
			const token = bearer[1];
			const info = this.jwtService.verify(token);
			(request as any).user = info.user;
			return true;
		} catch (e) {
			throw new UnauthorizedException('登录 token 失效，请重新登录！');
		}
	}
}
