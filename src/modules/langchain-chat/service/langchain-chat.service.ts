import { Injectable, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { AlibabaTongyiEmbeddings } from '@langchain/community/embeddings/alibaba_tongyi';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { covertDocsToString } from '@/utils/base';
import { MessageDTO } from '../dto/message';

@Injectable()
export class LangchainChatService {
	@Inject('KIMIAPI_CLIENT')
	private kimiApiClient: ChatOpenAI;
	@Inject('TONGYI_EMBEDDING')
	private tongyiEmbedding: AlibabaTongyiEmbeddings;

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

	async kimiApi(messageDTO: MessageDTO) {
		const { user_query } = messageDTO;
		const outputPrase = new StringOutputParser();
		const simpleChain = this.kimiApiClient.pipe(outputPrase);

		const text = await simpleChain.invoke([new HumanMessage(user_query)]);

		return this.generateObservable(text);
	}

	async vectorData(messageDTO: MessageDTO) {
		const { user_query } = messageDTO;
		const directory = 'src/database/qiu';

		const vectorStore = await FaissStore.load(directory, this.tongyiEmbedding);

		const retriever = vectorStore.asRetriever(2);

		const TEMPLATE = `
		你是一个熟读刘慈欣的《球状闪电》的终极原著党，精通根据作品原文详细解释和回答问题，你在回答时会引用作品原文。
		并且回答时仅根据原文，尽可能回答用户问题，如果原文中没有相关内容，你可以回答“原文中没有相关内容”，

		以下是原文中跟用户回答相关的内容：
		{context}

		现在，你需要基于原文，回答以下问题：
		{question}`;

		const prompt = ChatPromptTemplate.fromTemplate(TEMPLATE);

		const contextRetriverChain = RunnableSequence.from([
			input => input.question,
			retriever,
			covertDocsToString
		]);

		const ragChain = RunnableSequence.from([
			{
				context: contextRetriverChain,
				question: input => input.question
			},
			prompt,
			this.kimiApiClient,
			new StringOutputParser()
		]);

		const result = await ragChain.invoke({ question: user_query });

		return this.generateObservable(result);
	}
}
