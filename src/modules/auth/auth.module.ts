import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/auth.service';
import { CaptchaService } from './service/captcha.service';
import { AuthController } from './controller/auth.controller';
import { UserEntity } from '../user/entities/user';
import { UserRoleEntity } from '../user/entities/user.role';
import { RoleEntity } from '../role/entities/role';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity, RoleEntity])],
	controllers: [AuthController],
	providers: [AuthService, CaptchaService]
})
export class AuthModule {}
