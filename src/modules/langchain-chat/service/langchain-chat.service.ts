import { Injectable, Inject } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { MessageDTO } from '../dto/message';

@Injectable()
export class LangchainChatService {
	private messageSubject = new Subject<MessageEvent>();

	@Inject('OPENAI_CLIENT')
	private openaiClient: ChatOpenAI;

	sse(): Observable<MessageEvent> {
		return this.messageSubject.asObservable();
	}

	async typing(messageDTO: MessageDTO) {
		const { user_query } = messageDTO;
		const outputPrase = new StringOutputParser();
		const simpleChain = this.openaiClient.pipe(outputPrase);

		const text = await simpleChain.invoke([new HumanMessage(user_query)]);

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
}
