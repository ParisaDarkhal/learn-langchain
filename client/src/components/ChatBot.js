import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import Logo from "./images/Logo.png";
import SendIcon from "./images/send.svg";
import axios from "axios";

const ChatBot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatContainerRef = useRef(null);

  // Function to scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom on component update (when messages change)
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]); // Assuming 'messages' is the array of chat messages

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return; //to prevent empty input

    //add user message to chatMessages state
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", content: userInput },
    ]);
    //clear the input field after submission
    setUserInput("");

    //call pregressConversation here and update ChatMessages with AI response
    await progressConversation(userInput);
  };
  const progressConversation = async (question) => {
    //call api from backend
    try {
      //make a POST request to the API endpoit
      const response = await axios.post("http://localhost:3001/userQuestion", {
        question: question,
      });

      // Assuming your API returns data in the format { response: "AI response" }
      const aiResponse = response.data.response;

      // Add AI message to chatMessages state
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <div>
      <main>
        <section className="chatbot-container">
          <div className="chatbot-header">
            <img src={Logo} className="logo" alt="Logo" />
            {/* <p className="sub-heading">Knoledge Bank</p> */}
          </div>
          <div
            className="chatbot-conversation-container"
            id="chatbot-conversation-container"
            ref={chatContainerRef}
          >
            {/* render chat messages */}
            {chatMessages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={`speech ${
                    message.type === "user" ? "speech-human" : "speech-ai"
                  }`}
                >
                  {message.content}
                </div>
              );
            })}

            <form
              id="form"
              className="chatbot-input-container"
              onSubmit={handleSubmit}
            >
              <input
                name="user-input"
                type="text"
                id="user-input"
                value={userInput}
                onChange={handleChange}
                required
              />
              <button type="submit" id="submit-btn" className="submit-btn">
                <img src={SendIcon} className="send-btn-icon" alt="Send" />
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChatBot;
