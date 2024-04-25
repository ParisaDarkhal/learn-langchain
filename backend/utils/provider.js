import { createClient } from "@supabase/supabase-js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

const sbUrl = process.env.SUPABASE_URL;
const sbApiKey = process.env.SUPABASE_PRIVATE_KEY;
const openAIApiKey = process.env.OPENAI_API_KEY;

const supabaseClient = createClient(sbUrl, sbApiKey);

const loader = new PDFLoader("Malaria.pdf", {
  splitPages: true,
});

const fileContents = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 20,
});

const addDocumentsToVectorDB = async () => {
  const documents = await splitter.splitDocuments(fileContents);
  const embeddings = new OpenAIEmbeddings({ openAIApiKey });

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: "documents",
    queryName: "match_documents",
  });

  await vectorStore.addDocuments(documents);
  console.log("All documents embedded and added to vectorDB");
};

const addDocumentsToVectorDB_method2 = async () => {
  const documents = await splitter.splitDocuments(fileContents);
  // console.log("documents :>> ", documents);

  const embeddings = new OpenAIEmbeddings({ openAIApiKey });

  const vectorStore = await SupabaseVectorStore.fromDocuments(
    documents,
    embeddings,
    {
      client: supabaseClient,
      tableName: "documents",
      queryName: "match_documents",
    }
  );
  console.log("All documents embedded and added to vectorDB");
};

await addDocumentsToVectorDB();
