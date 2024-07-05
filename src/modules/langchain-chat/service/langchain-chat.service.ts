import { Injectable, Inject } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import {
	PromptTemplate,
	ChatPromptTemplate,
	PipelinePromptTemplate
} from '@langchain/core/prompts';
import { SerpAPILoader } from '@langchain/community/document_loaders/web/serpapi';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { MessageDTO } from '../dto/message';
import { ApiConfigService } from '@/shared/services/api-config.service';

@Injectable()
export class LangchainChatService {
	@Inject('KIMIAPI_CLIENT')
	private kimiApiClient: ChatOpenAI;

	@Inject(ApiConfigService)
	private apiConfigService: ApiConfigService;

	private generateObservable(text: string) {
		return new Observable<any>(observer => {
			let currentIndex = 0;
			const intervalId = setInterval(() => {
				if (currentIndex < text.length) {
					// 发送正常消息
					observer.next({
						data: JSON.stringify({
							data: text.substring(0, ++currentIndex),
							isEnd: false
						})
					});
				} else {
					// 发送结束信号
					observer.next({ data: JSON.stringify({ data: '', isEnd: true }) });
					clearInterval(intervalId);
					observer.complete();
				}
			}, 100);
		});
	}

	private getCurrentDateStr() {
		return new Date().toLocaleDateString();
	}

	private generateGreeting(timeOfDay: string) {
		const date = this.getCurrentDateStr();
		switch (timeOfDay) {
			case 'morning':
				return date + ' 早上好';
			case 'afternoon':
				return date + ' 下午好';
			case 'evening':
				return date + ' 晚上好';
			default:
				return date + ' 你好';
		}
	}

	/** 接入kimiApi */
	async kimiApi(messageDTO: MessageDTO) {
		const { user_query } = messageDTO;
		const outputPrase = new StringOutputParser();
		const simpleChain = this.kimiApiClient.pipe(outputPrase);

		const text = await simpleChain.invoke([new HumanMessage(user_query)]);

		return this.generateObservable(text);
	}
}
