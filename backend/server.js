// Import required modules
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

////
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import "dotenv/config";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { combineDocuments } from "./utils/combineDocuments.js";

import { formatDocumentsAsString } from "langchain/util/document";
import { RunnableSequence } from "@langchain/core/runnables";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
// import vectorStore from "./utils/provider.js";

////

// Create an Express app
const app = express();

// Configure Body Parser middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

//////////////////////////////////////////////////////////////////////
const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });
const sbApiKey = process.env.SUPABASE_PRIVATE_KEY;
const sbUrl = process.env.SUPABASE_URL;
const client = createClient(sbUrl, sbApiKey);

const embeddings = new OpenAIEmbeddings({ openAIApiKey });
const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents",
  queryName: "match_documents",
});

const getRetriever = () => {
  const retriever = vectorStore.asRetriever();
  return retriever;
};

//////////
app.post("/userQuestion", async (req, res) => {
  const { question } = req.body;

  console.log("question :>> ", question);

  //////////

  const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about "Retail Mail: Physical Standards for Letters, Cards, Flats, and Parcels" based on context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." and direct the questioner to  https://www.usps.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
question:{question}
answer:`;

  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  const retriever = getRetriever();

  const docs = await retriever.invoke(question);

  const context = formatDocumentsAsString(docs);
  // or
  // const context = combineDocuments(docs);

  const ragChain = RunnableSequence.from([
    answerPrompt,
    llm,
    new StringOutputParser(),
  ]);

  const response = await ragChain.invoke({
    question: question,
    context: context,
  });

  res.send({ response: response });
});
//////////////////////////////////////////////////////////////////////

// Define a route that serves a static file
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

// Define a route that handles POST requests
app.post("/submit", (req, res) => {
  const { name, email } = req.body;
  res.send(`Received POST request. Name: ${name}, Email: ${email}`);
});

// Start the server and listen on port 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🐱🐱🐱Server is running on http://localhost:${PORT}🐱🐱🐱`);
});
