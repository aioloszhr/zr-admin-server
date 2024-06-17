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
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		return true;
	}
}
