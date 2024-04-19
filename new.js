import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import "dotenv/config";

import { StringOutputParser } from "@langchain/core/output_parsers";
import retriever from "./utils/retriever.js";

const openAIApiKey = process.env.OPENAI_API_KEY;

const llm = new ChatOpenAI({ openAIApiKey });

const standaloneQuestionTemplate = `Given a question, convert it into a standalone question. Question: {question} standalone quesion: `;

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate
);

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about "Retail Mail: Physical Standards for Letters, Cards, Flats, and Parcels" based on context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." and direct the questioner to  https://www.usps.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
question:{question}
answer:`;

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

function combineDocuments(docs) {
  if (!Array.isArray(docs)) {
    docs = [docs];
  }
  return docs.map((doc) => (doc && doc.pageContent) || "").join("\n\n");
}

const chain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(new StringOutputParser())
  .pipe(retriever);

console.log("chain :>> ", chain);

const response = await chain.invoke({
  question:
    "I have a parcel to send to Chicago. what is standard weight of a parcel?",
});

// console.log("response :>> ", response);
