import { Module } from '@nestjs/common';
import { TrainDataService } from './service/train-data.service';
import { TrainDataController } from './controller/train-data.controller';

@Module({
	controllers: [TrainDataController],
	providers: [TrainDataService]
})
export class TrainDataModule {}
