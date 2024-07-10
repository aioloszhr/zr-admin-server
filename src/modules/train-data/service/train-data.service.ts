import { Inject, Injectable } from '@nestjs/common';
import { AlibabaTongyiEmbeddings } from '@langchain/community/embeddings/alibaba_tongyi';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

@Injectable()
export class TrainDataService {
	@Inject('TONGYI_EMBEDDING')
	private tongyiEmbedding: AlibabaTongyiEmbeddings;

	async trainData() {
		// 加载数据源
		const loader = new TextLoader('src/data/qiu.txt');
		// 文件过大，超过大部分LLM的上下文限制
		const docs = await loader.load();
		// 切割原始数据
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 50,
			chunkOverlap: 5
		});
		const splitDocs = await splitter.splitDocuments(docs);

		const vectorStore = await FaissStore.fromDocuments(splitDocs, this.tongyiEmbedding);

		const directory = 'src/database/qiu';
		await vectorStore.save(directory);
	}
}
