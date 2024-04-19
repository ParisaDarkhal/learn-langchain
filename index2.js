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
import { retriever } from "./utils/retriever";
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

////

//take the standaloneQuestionPrompt and PIPE model
const standaloneQuestionChain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(new StringOutputParser())
  .pipe(retriever);

//await the response when you INVOKE the chain. remember to pass in a question
const response = await standaloneQuestionChain.invoke({
  question:
    "I have a parcel to send to Chicago. what is standard weight of a parcel?",
});

console.log("response :>> ", response);

// const tweetTemplate = `Generate a promotional tweet for a product, from this product description: {productDesc}`;

// const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate);

// const tweetChain = tweetPrompt.pipe(llm);

// const response = await tweetChain.invoke({ productDesc: "parcel" });

// console.log("response :>> ", response.content);
