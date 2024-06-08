import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/auth.service';
import { CaptchaService } from './service/captcha.service';
import { AuthController } from './controller/auth.controller';
import { User } from '../user/entities/user.entity';
import { SharedModule } from '@/shared/shared.module';

@Module({
	imports: [TypeOrmModule.forFeature([User]), SharedModule],
	controllers: [AuthController],
	providers: [AuthService, CaptchaService]
})
export class AuthModule {}