import React, { useState } from 'react';
import axios from 'axios';
import Display from './Display';
import { MainContainer, ChatContainer, MessageList, Message, TypingIndicator, MessageInput } from '@chatscope/chat-ui-kit-react';

const API_KEY ="OPENAI API KEY"

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      direction: 'incoming',
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [display, setDisplay] = useState('Response will be displayed here');

  const handleSendRequest = async (message) => {
    const newMessage = {
      message,
      sentTime: "just now",
      direction: 'outgoing',
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);
    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sentTime: "just now",
          direction: 'incoming',
          sender: "ChatGPT",
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
        setDisplay(content);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const processMessageToChatGPT = async (chatMessages) => {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        { "role": "system", "content": "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };
    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", JSON.stringify(apiRequestBody), {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }

  };
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ height: "500px", width: "700px", padding: "1cm" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput data-testid="message-input" placeholder="Send a Message" onSend={handleSendRequest} />
          </ChatContainer>
        </MainContainer>
      </div>
      <div> <Display id="display" value={display} data-testid="display" /> </div>
    </div>
  );
};

export default Chatbot;
