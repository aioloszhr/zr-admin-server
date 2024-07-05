import { Body, Controller, Post, Sse, Inject, Query } from '@nestjs/common';
import { LangchainChatService } from '../service/langchain-chat.service';
import { MessageDTO } from '../dto/message';

@Controller('langchain-chat')
export class LangchainChatController {
	@Inject(LangchainChatService)
	private langchainChatService: LangchainChatService;

	@Sse('kimi-api')
	async kimiApi(@Query() messageDTO: MessageDTO) {
		return await this.langchainChatService.kimiApi(messageDTO);
	}
}
