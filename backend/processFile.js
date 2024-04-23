import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import fs from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

try {
  const result = await fs.readFile("101.txt", "utf8");
  const text = await result.toString();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ["\n\n", "\n", " ", ""],
    chunkOverlap: 50,
  });

  const output = await splitter.createDocuments([text]);

  const sbApiKey = process.env.SUPABASE_KEY;
  //   console.log("sbApiKey :>> ", sbApiKey);
  const sbUrl = process.env.SUPABASE_URL;
  const openAIApiKey = process.env.OPENAI_API_KEY;

  const client = createClient(sbUrl, sbApiKey);

  await SupabaseVectorStore.fromDocuments(
    output,
    new OpenAIEmbeddings({ openAIApiKey: openAIApiKey }),
    {
      client: client,
      tableName: "documents",
    }
  );
  console.log(output);
} catch (error) {
  console.log(error);
}