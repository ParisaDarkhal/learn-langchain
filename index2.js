import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import "dotenv/config";
///
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import fs from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import retriever from "./utils/retriever.js";
import { combineDocuments } from "./utils/combineDocuments.js";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
///

const openAIApiKey = process.env.OPENAI_API_KEY;

//////////
// document.addEventListener("submit", (e) => {
//   e.preventDefault();
//   progressConverstion();
// });
//////////
//a string holding the phrasing of the prompt

///
// const embeddings = new OpenAIEmbeddings({ openAIApiKey });

// const sbApiKey = process.env.SUPABASE_KEY;
// const sbUrl = process.env.SUPABASE_URL;
// const client = createClient(sbUrl, sbApiKey);

// const vectorStore = new SupabaseVectorStore(embeddings, {
//   client,
//   tableName: "documents",
//   queryName: "match_documents",
// });

// const retriever = vectorStore.asRetriever();

const llm = new ChatOpenAI({ openAIApiKey });
///

const punctuationTemplate = `Given a sentence, add punctuation where needed.
sentence:{sentence}
sentence with punctuation`;

const punctuationPrompt = PromptTemplate.fromTemplate(punctuationTemplate);

const grammarTemplate = `Given a sentence, correct the grammar.
sentence:{punctuated_sentence}
sentence with correct grammar:`;

const grammarPrompt = PromptTemplate.fromTemplate(grammarTemplate);

const translationTemplate = `Given a sentence, translate that sentence into {language}
    sentence: {grammatically_correct_sentence}
    translated sentence:
    `;
const translationPrompt = PromptTemplate.fromTemplate(translationTemplate);

const standaloneQuestionTemplate = `Given a question, convert it into a standalone question. Question: {question} standalone quesion: `;

//a prompt created using PromptTemplate and the fromTemplate method
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate
);

////
const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about "Retail Mail: Physical Standards for Letters, Cards, Flats, and Parcels" based on context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." and direct the questioner to  https://www.usps.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
question:{question}
answer:`;

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

// function combineDocuments(docs) {
//   // return docs.map((doc) => doc.pageContent).join("\n\n");
//   if (!Array.isArray(docs)) {
//     docs = [docs];
//   }
//   return docs.map((doc) => (doc && doc.pageContent) || "").join("\n\n");
// }

// const chain = standaloneQuestionPrompt
//   .pipe(llm)
//   .pipe(new StringOutputParser())
//   .pipe(retriever)
//   .pipe(combineDocuments)
//   .pipe(answerPrompt);

const punctuationChain = RunnableSequence.from([
  punctuationPrompt,
  llm,
  new StringOutputParser(),
]);

const grammarChain = RunnableSequence.from([
  grammarPrompt,
  llm,
  new StringOutputParser(),
]);

const translationChain = RunnableSequence.from([
  translationPrompt,
  llm,
  new StringOutputParser(),
]);

const chain = RunnableSequence.from([
  {
    punctuated_sentence: punctuationChain,
    original_input: new RunnablePassthrough(),
  },
  {
    grammatically_correct_sentence: grammarChain,
    language: ({ original_input }) => original_input.language,
  },
  translationChain,
]);
////

//take the standaloneQuestionPrompt and PIPE model
// const standaloneQuestionChain = standaloneQuestionPrompt
//   .pipe(llm)
//   .pipe(new StringOutputParser())
//   .pipe(retriever);

//await the response when you INVOKE the chain. remember to pass in a question
const response = await chain.invoke({
  question:
    "I have a parcel to send to Chicago. what is standard weight of a parcel?",
});

console.log("response :>> ", response);

// const tweetTemplate = `Generate a promotional tweet for a product, from this product description: {productDesc}`;

// const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate);

// const tweetChain = tweetPrompt.pipe(llm);

// const response = await tweetChain.invoke({ productDesc: "parcel" });

// console.log("response :>> ", response.content);
