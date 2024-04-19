import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const openAIApiKey = process.env.OPENAI_API_KEY;

const embeddings = new OpenAIEmbeddings({ openAIApiKey });

const sbApiKey = process.env.SUPABASE_KEY;
const sbUrl = process.env.SUPABASE_URL;
const client = createClient(sbUrl, sbApiKey);

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents",
  queryName: "match_documents",
});

const retriever = vectorStore.asRetriever();

// module.exports = {retriever};
export default { retriever };
