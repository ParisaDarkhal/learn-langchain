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

//////////
// document.addEventListener("submit", (e) => {
//   e.preventDefault();
//   progressConverstion();
// });
//////////

const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

const standaloneQuestionTemplate = `Given a question, convert it into a standalone question. Question: {question} standalone quesion: `;

//a prompt created using PromptTemplate and the fromTemplate method
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate
);

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about "Retail Mail: Physical Standards for Letters, Cards, Flats, and Parcels" based on context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." and direct the questioner to  https://www.usps.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
question:{question}
answer:`;

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

//take the standaloneQuestionPrompt and PIPE model
const standaloneQuestionChain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(new StringOutputParser());

const retrieverChain = RunnableSequence.from([
  (prevResult) => prevResult.standalone_question,
  retriever,
  combineDocuments,
]);

const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

const chain = RunnableSequence.from([
  {
    standalone_question: standaloneQuestionChain,
    original_input: new RunnablePassthrough(),
  },
  {
    context: retrieverChain,
    question: ({ original_input }) => original_input.question,
  },
  answerChain,
]);

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

////

//await the response when you INVOKE the chain. remember to pass in a question
const response = await chain.invoke({
  question:
    "I have a parcel to send to Chicago. what is standard weight of a parcel?",
});

console.log("response :>> ", response);


async function progressConversation() {
  const userInput = document.getElementById("user-input");
  const chatbotConversation = document.getElementById(
    "chatbot-conversation-container"
  );
  const question = userInput.value;
  userInput.value = "";

  // add human message
  const newHumanSpeechBubble = document.createElement("div");
  newHumanSpeechBubble.classList.add("speech", "speech-human");
  chatbotConversation.appendChild(newHumanSpeechBubble);
  newHumanSpeechBubble.textContent = question;
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

  // add AI message
  const newAiSpeechBubble = document.createElement("div");
  newAiSpeechBubble.classList.add("speech", "speech-ai");
  chatbotConversation.appendChild(newAiSpeechBubble);
  newAiSpeechBubble.textContent = result;
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
}
