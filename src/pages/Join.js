import React, { useState } from "react";
import { Link } from "react-router-dom";
import randomColor from "randomcolor";

export const color = randomColor();
const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div
      className="container-fluid"
      style={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: color,
        height: "100vh",
      }}
    >
      <h1 className="display-1" style={{ margin: "20px 0 0 0" }}>
        Online Chat App
      </h1>
      <h1 className="display-4" style={{ margin: "0 0 30px 0" }}>
        with Draw & Guess
      </h1>
      <input
        className="form-control"
        style={{ margin: "20px auto", width: "30%" }}
        placeholder="NickName"
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        className="form-control"
        style={{ margin: "20px auto", width: "30%" }}
        placeholder="RoomName"
        type="text"
        value={room}
        onChange={(e) => {
          setRoom(e.target.value);
        }}
      />
      <Link
        onClick={(e) => (!name || !room ? e.preventDefault : null)}
        to={`/chat?name=${name}&room=${room}`}
      >
        <button className="btn btn-dark" type="submit">
          Join Room!
        </button>
      </Link>
    </div>
  );
};

export default Join;
