import { Document } from '@langchain/core/dist/documents/document';

export const covertDocsToString = (documents: Document[]) => {
	return documents.map(document => document.pageContent).join('\n');
};
