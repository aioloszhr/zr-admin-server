import { Controller, Get, Inject } from '@nestjs/common';
import { TrainDataService } from '../service/train-data.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('trainData')
@Controller('train-data')
export class TrainDataController {
	@Inject(TrainDataService)
	private trainDataService: TrainDataService;

	@ApiOperation({ description: '训练数据' })
	@Get()
	async trainData() {
		await this.trainDataService.trainData();
	}
}
