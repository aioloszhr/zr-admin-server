import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { UserRoleEntity } from './entities/user.role';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity])],
	controllers: [UserController],
	providers: [UserService]
})
export class UserModule {}
