import { Module } from '@nestjs/common';
import { LangchainChatService } from './service/langchain-chat.service';
import { LangchainChatController } from './controller/langchain-chat.controller';

@Module({
	controllers: [LangchainChatController],
	providers: [LangchainChatService]
})
export class LangchainChatModule {}
