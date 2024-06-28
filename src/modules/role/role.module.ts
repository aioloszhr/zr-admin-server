import { Module } from '@nestjs/common';
import { RoleService } from './service/role.service';
import { RoleController } from './controller/role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role';
import { RoleMenuEntity } from './entities/role.menu';
import { SocketService } from '../socket/socket.service';
import { UserRoleEntity } from '../user/entities/user.role';

@Module({
	imports: [TypeOrmModule.forFeature([RoleEntity, RoleMenuEntity, UserRoleEntity])],
	controllers: [RoleController],
	providers: [RoleService, SocketService]
})
export class RoleModule {}
