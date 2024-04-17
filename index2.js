import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import "dotenv/config";

const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

const tweetTemplate = `Generate a promotional tweet for a product, from this product description: {productDesc}`;

const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate);

const tweetChain = tweetPrompt.pipe(llm);

const response = await tweetChain.invoke({ productDesc: "parcel" });

console.log("response :>> ", response.content);
