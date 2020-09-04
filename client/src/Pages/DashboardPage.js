import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";

function DashboardPage(props) {
  const [chatrooms, setChatrooms] = useState([]);
  const chatroomNameRef = React.createRef();

  const createChatroom = () => {
    const name = chatroomNameRef.current.value;

    axios
      .post(
        "http://localhost:8000/chatroom",
        {
          name,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("CC_Token"),
          },
        }
      )
      .then((response) => {
        alert(response.data.message);
        props.history.push("/");
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          alert(err.response.data.message);
      });
  };

  const getChatrooms = () => {
    axios
      .get("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            placeholder="Dance Room"
            ref={chatroomNameRef}
          />
        </div>
        <button onClick={createChatroom}>Create Chatroom</button>
        <div className="chatrooms">
          {chatrooms.map((chatroom) => (
            <div key={chatroom._id} className="chatroom">
              <div>{chatroom.name}</div>
              <Link to={"/chatroom/" + chatroom._id}>
                <div className="join">Join</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withRouter(DashboardPage);
