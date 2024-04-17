import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import "dotenv/config";

const openAIApiKey = process.env.OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

//////////
// document.addEventListener("submit", (e) => {
//   e.preventDefault();
//   progressConverstion();
// });
//////////
//a string holding the phrasing of the prompt
const standaloneQuestionTemplate = `Generate a standalone question for a user's question, from this user's question: {userQuestion}`;

//a prompt created using PromptTemplate and the fromTemplate method
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate
);

//take the standaloneQuestionPrompt and PIPE model
const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm);

//await the response when you INVOKE the chain. remember to pass in a question
const response = await standaloneQuestionChain.invoke({
  userQuestion:
    "I have a parcel to send to Chicago. what is standard weight of a parcel?",
});

console.log("response :>> ", response.content);

// const tweetTemplate = `Generate a promotional tweet for a product, from this product description: {productDesc}`;

// const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate);

// const tweetChain = tweetPrompt.pipe(llm);

// const response = await tweetChain.invoke({ productDesc: "parcel" });

// console.log("response :>> ", response.content);
