import React from "react";

const ChatBox = (props) => {
  const { messages, socket } = props;
  return messages.map((message) => {
    let align = socket.id === message.user.id ? "right" : "left";
    if (message.user.id === "-1") {
      return (
        <div>
          <div style={{ textAlign: "center", padding: "0 20px" }}>
            <label
              className="my-1 mr-3 ml-auto"
              style={{
                color: message.user.color,
                margin: "5px auto",
              }}
            >
              {message.user.name}
            </label>
            <div
              className="alert alert-light rounded"
              style={{
                width: "fit-content",
                padding: "2px 10px",
                wordBreak: "break-all",
                wordWrap: "break-word",
                margin: "0 auto",
              }}
            >
              {message.text}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div style={{ textAlign: align, padding: "0 20px" }}>
          <label
            className="h6 my-1 mr-3 ml-auto"
            style={{
              color: message.user.color,
              margin:
                align === "right" ? "5px 0px 5px auto" : "5px auto 5px 0px",
            }}
          >
            {message.user.name}
          </label>
          <div
            className="h4 alert alert-primary border border-primary rounded"
            style={{
              maxWidth: "33vw",
              width: "fit-content",
              padding: "2px 10px",
              wordBreak: "break-all",
              wordWrap: "break-word",
              margin:
                align === "right" ? "auto 0px auto auto" : "auto auto auto 0px",
              textAlignLast: "left",
            }}
          >
            {message.text}
          </div>
        </div>
      </div>
    );
  });
};

export default ChatBox;
