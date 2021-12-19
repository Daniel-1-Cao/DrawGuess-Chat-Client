import React from "react";

const InputBox = (props) => {
  const { message, setMessage, sendMessage } = props;
  return (
    <div className="input-group my-3 round">
      <input
        className="form-control"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) =>
          e.key === "Enter" && message !== "" ? sendMessage(e) : null
        }
      />
      <div className="input-group-append">
        <button
          style={{ width: "100px" }}
          type="button"
          className="btn btn-primary"
          onClick={(e) => (message !== "" ? sendMessage(e) : null)}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default InputBox;
