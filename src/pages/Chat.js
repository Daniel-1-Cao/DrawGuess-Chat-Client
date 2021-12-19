import React, { useState, useEffect, useRef } from "react";
import queryString from "query-string";
import InputBox from "../components/InputBox";
import ChatBox from "../components/ChatBox";
import DrawBox from "../components/DrawBox";
import "../components/ModalBox.css";
import { color } from "./Join";
import Modal from "react-bootstrap/Modal";
import socket from "../socketConfig";

const Chat = ({ location }) => {
  // eslint-disable-next-line
  const [name, setName] = useState("");
  // eslint-disable-next-line
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showDrawBox, setShowDrawBox] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const scrollEl = useRef(null);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    setName(name);
    setRoom(room);
    socket.emit("join", { name, room, color }, () => {});

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [location.search]);

  useEffect(() => {
    scrollEl.current.scrollIntoView({ behavior: "smooth" });
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
    return () => {
      socket.off("message");
    };
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  const handleModal = () => {
    if (!showModal) {
      socket.emit("getOnlineUsers", room, (users) => {
        setUsers(users);
      });
    }
    setShowModal(!showModal);
  };

  const handleDrawBox = () => {
    socket.emit("addPlayer", socket.id, name, room);
    setShowDrawBox(true);
  };

  return (
    <div
      className="d-flex flex-row"
      style={{ height: "100vh", backgroundColor: "#38A3A5" }}
    >
      {showDrawBox ? (
        <div style={{ width: "67vw" }}>
          <DrawBox setShowDrawBox={setShowDrawBox} room={room} />
        </div>
      ) : null}
      <div
        style={{ width: showDrawBox ? "33vw" : "100%" }}
        className="d-flex flex-column container-fluid h-100"
      >
        <div className="d-flex flex-row">
          <div className="h1 flex-grow-1">{room}</div>
          <button
            className="btn btn-secondary m-3"
            onClick={() => {
              handleDrawBox();
            }}
          >
            <i className="bi bi-easel" style={{ padding: "0 5px" }}></i>
            Draw and Guess
          </button>
          <button
            type="button"
            className="btn btn-secondary m-3"
            onClick={handleModal}
          >
            <i className="bi bi-three-dots" style={{ padding: "0 5px" }}></i>
          </button>
        </div>

        <div
          className="flex-grow-1 border border-primary round-lg"
          style={{
            backgroundColor: "#E8F6EF",
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          <ChatBox messages={messages} socket={socket} />
          <div style={{ margin: "20px" }} ref={scrollEl}></div>
        </div>

        <InputBox
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <Modal show={showModal} onHide={handleModal} className="modal-dialog">
        <Modal.Header closeButton>
          <Modal.Title>Online Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <ul className="list-group list-group-flush">
              {users.map((user) => {
                return (
                  <li
                    className="list-group-item h3"
                    style={{ color: user.color }}
                  >
                    {user.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Chat;
