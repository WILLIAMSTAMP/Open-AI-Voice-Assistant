import React, { useState, useEffect, useContext } from "react";
import "./chatgpt.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.css";
import io from "socket.io-client";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useNavigate } from "react-router-dom";
import { BsMic } from "react-icons/bs";
import SocketContext from "./SocketContext";

function ChatGpt() {
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioQueue, setAudioQueue] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", { withCredentials: true });

    newSocket.on("user logged in", function (username) {
      localStorage.setItem("username", username);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("audio", async (audioBuffer, botResponse) => {
        console.log("Received bot response:", botResponse);
        try {
          const audioBlob = new Blob([new Uint8Array(audioBuffer)], {
            type: "audio/mp3",
          });
          const audioUrl = URL.createObjectURL(audioBlob);

          const audio = new Audio(audioUrl);
          audio.addEventListener("ended", () => {
            console.log("Audio playback ended");
            playNextAudio();
          });
          audio.play().catch((error) => {
            console.error("Error playing audio:", error);
            playNextAudio();
          });
        } catch (error) {
          console.error("Error generating audio URL:", error);
          playNextAudio();
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "ChatGPT",
            message: botResponse,
          },
        ]);

        setIsTyping(false);
      });
    }
  }, [socket]);

  function handleSend(message) {
    const div = document.createElement('div');
    div.innerHTML = message;
    const plainTextMessage = div.textContent || div.innerText || '';

    const username = localStorage.getItem("username");
    const userMessage = {
      sender: username,
      message: plainTextMessage,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setIsTyping(true);

    if (socket) {
      socket.emit("chat", userMessage);
    } else {
      console.error("Socket is not connected yet.");
    }
  }

  const startVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const message = event.results[0][0].transcript;
      handleSend(message);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const logout = () => {
    if (socket) {
      socket.emit("logout");
    }
  
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("profile");
    navigate("/login");
  };

  const playNextAudio = () => {
    if (audioQueue.length > 0) {
      const audioBuffer = audioQueue[0];
      setAudioQueue((prevQueue) => prevQueue.slice(1));

      try {
        const audioBlob = new Blob([new Uint8Array(audioBuffer)], {
          type: "audio/mp3",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        audio.addEventListener("ended", () => {
          console.log("Audio playback ended");
          playNextAudio();
        });
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
          playNextAudio();
        });
      } catch (error) {
        console.error("Error generating audio URL:", error);
        playNextAudio();
      }
    }
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <main className="main">
      <div className="gpt_container">
        <div className="content">
          <div className="text-content">
            <div className="home text chatgpt">
              <div className="title">Your AI Companion</div>
              <div className="message">
                <MainContainer>
                  <ChatContainer>
                    <MessageList>
                      {messages.map((message, i) => (
                        <Message
                          key={i}
                          model={{
                            message: message.message,
                            sender: message.sender,
                            direction:
                              message.sender === "ChatGPT"
                                ? "incoming"
                                : "outgoing",
                            sentTime: "just now",
                          }}
                          className={
                            message.sender === "ChatGPT"
                              ? "incoming-message"
                              : "outgoing-message"
                          }
                        />
                      ))}
                    </MessageList>
                    <MessageInput
                      placeholder="Enter message here"
                      onSend={handleSend}
                    />
                  </ChatContainer>
                </MainContainer>
                <div className="mic-button-container">
                  <button
                    type="button"
                    className={`cs-voice-input-button ${
                      isListening ? "listening" : ""
                    }`}
                    onClick={startVoiceInput}
                  >
                    <BsMic
                      size={30}
                      color={isListening ? "green" : "blue"}
                    />
                  </button>
                </div>
                <div className="logout-button">
                  <button onClick={logout}>Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ChatGpt;
// // v2.0
// import React, { useState, useEffect } from "react";
// import "./chatgpt.css";
// import "@chatscope/chat-ui-kit-styles/dist/default/styles.css";
// import { BsMic } from "react-icons/bs";
// import io from "socket.io-client";
// import {
//   MainContainer,
//   ChatContainer,
//   MessageList,
//   Message,
//   MessageInput,
// } from "@chatscope/chat-ui-kit-react";
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@chatscope/chat-ui-kit-react';
// let currentAudioSource = null;



// function ChatGpt() {
//  const navigate = useNavigate();

//   const [audioUrl, setAudioUrl] = useState("");
//   const systemMessage = {
//     role: "system",
//     content:
//       "As Nova, a virtual nurse assistant, your role is to provide compassionate conversation and engagement to residents in a long-term care facility, many of whom have physical or cognitive impairments. Keep in mind that there are medical professionals available for any serious concerns. Your aim is to encourage ongoing conversation. Begin by asking for and remembering each resident's name. ",
//   };
//   const API_KEY = "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";
//   const [isListening, setIsListening] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       message: "Hello, I am your AI companion. What would you like to talk about?",
//       sentTime: "just now",
//       sender: "ChatGPT",
//     },
//   ]);
//   const [isTyping, setIsTyping] = useState(false);

//   const socket = io("http://localhost:3001");

//   useEffect(() => {
//     socket.on("audio", async (audioBuffer) => {
//       try {
//         // Convert the ArrayBuffer to a Blob
//         const audioBlob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/mp3' });
//         const audioUrl = URL.createObjectURL(audioBlob);

//         const audio = new Audio(audioUrl);
//         audio.play()
//           .then(() => {
//             console.log("Audio playback started");
//           })
//           .catch((error) => {
//             console.error("Error playing audio:", error);
//           });
//       } catch (error) {
//         console.error('Error generating audio URL:', error);
//       }
//       setIsTyping(true);
//     }, []);
//   });

//   function playAudio(url) {
//     const audio = new Audio(url);
//     audio.play()
//       .then(() => {
//         console.log("Audio playback started");
//       })
//       .catch((error) => {
//         console.error("Error playing audio:", error);
//       });
//   }

// async function processMessageToChatGPT(chatMessages) {
//   let apiMessages = chatMessages.map((messageObject) => {
//     let role = "";
//     if (messageObject.sender === "ChatGPT") {
//       role = "assistant";
//     } else {
//       role = "user";
//     }
//     return { role: role, content: messageObject.message };
//   });

//   const apiRequestBody = {
//     model: "gpt-3.5-turbo-0301",
//     messages: [systemMessage, ...apiMessages],
//   };

//   const response = await fetch("https://api.openai.com/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: "Bearer " + API_KEY,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(apiRequestBody),
//   });

//   const data = await response.json();
//   const botMessageContent = data.choices[0].message.content;

//   const botMessage = {
//     message: botMessageContent,
//     sender: "ChatGPT",
//   };

//   setMessages((prevMessages) => [...prevMessages, botMessage]);
//   setIsTyping(false);

//   socket.emit("bot message", botMessageContent);
//   socket.emit('chat', botMessageContent); // this line triggers speech generation on the server
// }

//      function handleSend(message) {
//        const newMessage = {
//          sender: "user",
//          message: message,
//        };

//        setMessages((prevMessages) => [...prevMessages, newMessage]);
//        setIsTyping(true);
//        processMessageToChatGPT([...messages, newMessage]);
//      }

//      const startVoiceInput = () => {
//        const recognition = new window.webkitSpeechRecognition();
//        recognition.lang = "en-US";
//        recognition.interimResults = false;
//        recognition.maxAlternatives = 1;

//        setIsListening(true);

//        recognition.start();

//        recognition.onresult = (event) => {
//          const message = event.results[0][0].transcript;
//          handleSend(message);
//          setIsListening(false);
//        };

//        recognition.onerror = (event) => {
//          setIsListening(false);
//        };

//        recognition.onend = () => {
//          setIsListening(false);
//        };
//      };


//  // Logout action
//   const logout = () => {

//     // Clear the token and profile from window.localStorage
//     window.localStorage.removeItem('token');
//     window.localStorage.removeItem('profile');

//     navigate('/login');
//   };

//   return (
//      <main className="main">
//        <div className="gpt_container">
//          <div className="content">
//            <div className="text-content">
//              <div className="home text chatgpt">
//                <div className="title">Your AI Companion</div>
//                <div className="message">
//                  <MainContainer>
//                    <ChatContainer>
//                      <MessageList>
//                        {messages.map((message, i) => (
//                          <Message key={i} model={message} />
//                        ))}
//                      </MessageList>
//                      <MessageInput
//                        placeholder="Enter message here"
//                        onSend={handleSend}
//                      />
//                    </ChatContainer>
//                  </MainContainer>
//                  <div className="mic-button-container">
//                    <button
//                      type="button"
//                      className={`cs-voice-input-button ${
//                        isListening ? "listening" : ""
//                      }`}
//                      onClick={startVoiceInput}
//                    >
//                      <BsMic
//                        size={30}
//                        color={isListening ? "green" : "blue"}
//                      />
//                    </button>
//                  </div>
//                  <div className="logout-button">
//                         <button onClick={logout}>Logout</button>
//                       </div>
//                </div>
//              </div>
//            </div>
//          </div>
//        </div>
//      </main>
//    );
//  }

//  export default ChatGpt;