# Learn LangChain Chatbot

learn-LangChain is a project to create a chatbot designed to showcase the integration of various technologies for building a powerful conversational interface.

## Demo Video
<https://youtu.be/zX4H2t1AJ-I>

## Components

- **Backend:** Node.js with Express
- **Vector Database:** Supabase (@supabase)
- **Orchestration:** LangChainAI (@LangChainAI)
- **Frontend:** React.js

## Features

- Seamless integration of backend, vector database, and orchestration services.
- Advanced natural language processing capabilities using LangChainAI.
- Interactive user interface built with React.js.
- Secure user authentication and data management with Supabase.
- Extensible architecture for adding new features and integrations.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ParisaDarkhal/learn-langchain.git
   ```

2. Install dependencies:

   ```bash
   cd learn-langchain/backend
   npm install
   cd ..
   cd client
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   LANGCHAIN_API_KEY=your_langchain_api_key
   ```

4. Start the development server:

   ```bash
   cd backend
   npx nodemon server.js

in a differnt terminal:
```bash
    cd client
    npm start
   ```

5. Access the application:

   Open your browser and visit `http://localhost:3000`.

## Dependencies

- [@langchain/community](https://www.npmjs.com/package/@langchain/community): ^0.0.51
- [@langchain/core](https://www.npmjs.com/package/@langchain/core): ^0.1.60
- [@langchain/openai](https://www.npmjs.com/package/@langchain/openai): ^0.0.28
- [@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js): ^2.42.7
- [body-parser](https://www.npmjs.com/package/body-parser): ^1.20.2
- [cors](https://www.npmjs.com/package/cors): ^2.8.5
- [dotenv](https://www.npmjs.com/package/dotenv): ^16.4.5
- [express](https://www.npmjs.com/package/express): ^4.19.2
- [langchain](https://www.npmjs.com/package/langchain): ^0.1.36
- [path](https://www.npmjs.com/package/path): ^0.12.7
- [pdf-parse](https://www.npmjs.com/package/pdf-parse): ^1.1.1
- [axios](https://www.npmjs.com/package/axios): ^1.6.8
- [react](https://www.npmjs.com/package/react): ^18.2.0

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


