import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './service/menu.service';
import { MenuController } from './controller/menu.controller';
import { MenuEntity } from './entity/menu';

@Module({
	imports: [TypeOrmModule.forFeature([MenuEntity])],
	controllers: [MenuController],
	providers: [MenuService]
})
export class MenuModule {}
