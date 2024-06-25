import { Module } from '@nestjs/common';
import { RoleService } from './service/role.service';
import { RoleController } from './controller/role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role';
import { RoleMenuEntity } from './entities/role.menu';

@Module({
	imports: [TypeOrmModule.forFeature([RoleEntity, RoleMenuEntity])],
	controllers: [RoleController],
	providers: [RoleService]
})
export class RoleModule {}
