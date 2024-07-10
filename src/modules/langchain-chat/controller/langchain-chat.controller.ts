import { Controller, Sse, Inject, Query, Body } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { LangchainChatService } from '../service/langchain-chat.service';
import { MessageDTO } from '../dto/message';

@Controller('langchain-chat')
export class LangchainChatController {
	@Inject(LangchainChatService)
	private langchainChatService: LangchainChatService;

	@ApiOperation({ description: '调用kimiApi' })
	@Sse('kimi-api')
	async kimiApi(@Query() messageDTO: MessageDTO) {
		return await this.langchainChatService.kimiApi(messageDTO);
	}

	@ApiOperation({ description: '获取向量数据' })
	@Sse('vector-data')
	async vectorData(@Body() messageDTO: MessageDTO) {
		return await this.langchainChatService.vectorData(messageDTO);
	}
}
