export const combineDocuments = (docs) => {
  if (!Array.isArray(docs)) {
    docs = [docs];
  }
  return docs.map((doc) => doc.pageContent).join("\n\n");
};
