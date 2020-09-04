import React from "react";
import { withRouter } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

function ChatroomPage({ match, socket }) {
  const chatroomId = match.params.id;
  const [messages, setMessages] = useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");

  const sendMessage = () => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
    }
  };

  useEffect(() => {
    if (socket) {
      console.log("Setting up");
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
    // eslint-disable-next-line
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      //component unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Just Chat!</div>
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <p
              key={i}
              className={`message ${userId === message.userId && "ownMessage"}`}
            >
              <span className="chatname">{message.name}</span> {message.message}
            </p>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Type your message"
              ref={messageRef}
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(ChatroomPage);
