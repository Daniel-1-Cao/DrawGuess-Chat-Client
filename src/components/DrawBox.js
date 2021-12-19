import React, { useState, useEffect, useRef } from "react";
import socket from "../socketConfig";
import { CirclePicker } from "react-color";

const GameControl = (props) => {
  const { room } = props;
  // eslint-disable-next-line no-unused-vars
  const [word, setWord] = useState(null);

  const renderWord = (e) => {
    if (e.target.innerText === "Next") {
      socket.emit("updatePlayer", room);
      setWord(null);
    } else {
      socket.emit("retrieveWord", (randomWord) => {
        setWord(randomWord);
      });
    }
  };

  return (
    <div className="d-flex flex-row">
      <div className="h1" style={{ margin: "10px 0 0 16px" }}>
        {word}
      </div>
      <button
        className="h3 btn btn-light"
        style={{ margin: "16px 0 0 16px" }}
        onClick={renderWord}
      >
        {word ? "Next" : "Start"}
      </button>
      <button
        className="h3 btn btn-light"
        style={{ margin: "16px 0 0 16px" }}
        onClick={renderWord}
      >
        Refresh
      </button>
    </div>
  );
};

const DrawBox = (props) => {
  const { setShowDrawBox, room } = props;
  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [selfId, setSelfId] = useState(null);
  // eslint-disable-next-line
  const [curPlayer, setCurPlayer] = useState(null);
  const [curCanvas, setCurCanvas] = useState({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({});
  const [penColor, setPenColor] = useState("black");
  const [penWidth, setPenWidth] = useState(2);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    socket.on("defaultDrawer", (id, curDrawer) => {
      setCurPlayer(curDrawer);
      setSelfId(id);
    });
    return () => {
      socket.off("defaultDrawer");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("playerChanged", (curPlayer) => {
      setCurPlayer(curPlayer);
      setPenColor("black");
      setPenWidth(2);
      clearDrawing();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curPlayer]);

  useEffect(() => {
    const canvasContainer = canvasContainerRef.current;
    setCanvasSize({
      width: canvasContainer.offsetWidth - 34,
      height: canvasContainer.offsetHeight - 40,
    });
    const canvas = canvasRef.current;
    contextRef.current = canvas.getContext("2d");
    socket.on("drawing", (data) => {
      drawLine(
        data.x0,
        data.y0,
        data.x1,
        data.y1,
        false,
        data.color,
        data.width
      );
    });
    socket.on("clearBoard", () => {
      clearDrawing();
    });
    return () => {
      socket.off("drawing");
      socket.off("clearBoard");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function drawLine(x0, y0, x1, y1, emit, color, width) {
    const context = contextRef.current;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineCap = "round";
    context.strokeStyle = color || penColor;
    context.lineWidth = width || penWidth;
    context.stroke();
    context.closePath();

    if (!emit) {
      return;
    }

    socket.emit("drawing", {
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
      room,
      color: penColor,
      width: penWidth,
    });
  }

  const startDrawing = (nativeEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    setCurCanvas({ x: offsetX, y: offsetY });
    canvasRef.current.addEventListener(
      "mouseout",
      () => {
        setIsDrawing(false);
      },
      false
    );
  };

  const drawing = (nativeEvent) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    drawLine(curCanvas.x, curCanvas.y, offsetX, offsetY, true);
    setCurCanvas({ x: offsetX, y: offsetY });
  };

  const doneDrawing = () => {
    if (!isDrawing) {
      return;
    }
    setIsDrawing(false);
  };

  const clearDrawing = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleCloseDrawBox = () => {
    if (selfId && curPlayer && selfId === curPlayer.id) {
      socket.emit("checkExitable", room, (onlyOne) => {
        if (onlyOne) {
          socket.emit("removePlayer", socket.id, room);
          setShowDrawBox(false);
        }
      });
    } else {
      socket.emit("removePlayer", socket.id, room);
      setShowDrawBox(false);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <div className="d-flex flex-row">
        <div className="h1 flex-grow-1">
          {selfId && curPlayer && selfId === curPlayer.id ? (
            <GameControl room={room} />
          ) : null}
        </div>
        <button
          type="button"
          className="btn btn-light m-3"
          onClick={() => {
            setPenColor("black");
            setPenWidth(2);
          }}
        >
          <i className="bi bi-pencil" style={{ padding: "0 5px" }}></i>
        </button>
        <button
          type="button"
          className="btn btn-light m-3"
          onClick={() => {
            setPenColor("white");
            setPenWidth(20);
          }}
        >
          <i className="bi bi-eraser" style={{ padding: "0 5px" }}></i>
        </button>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="btn btn-light m-3"
            onClick={() => {
              setShowColorPicker(true);
            }}
          >
            <i className="bi bi-palette" style={{ padding: "0 5px" }}></i>
          </button>
          {showColorPicker ? (
            <div style={{ position: "absolute" }}>
              <CirclePicker
                onChange={(color) => {
                  setPenColor(color.hex);
                  setPenWidth(2);
                  setShowColorPicker(false);
                }}
              />
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className="btn btn-light m-3"
          onClick={() => {
            socket.emit("clearAllBoard", room);
          }}
        >
          <i className="bi bi-trash" style={{ padding: "0 5px" }}></i>
        </button>
        <button
          type="button"
          className="btn btn-secondary m-3"
          onClick={() => handleCloseDrawBox()}
        >
          <i className="bi bi-x-lg" style={{ padding: "0 5px" }}></i>
        </button>
      </div>

      <div className="flex-grow-1" ref={canvasContainerRef}>
        <canvas
          ref={canvasRef}
          className="border border-dark rounded m-3"
          width={canvasSize.width}
          height={canvasSize.height}
          style={{ backgroundColor: "white" }}
          onMouseDown={(e) =>
            selfId && curPlayer && selfId === curPlayer.id
              ? startDrawing(e.nativeEvent)
              : null
          }
          onMouseMove={(e) =>
            selfId && curPlayer && selfId === curPlayer.id
              ? drawing(e.nativeEvent)
              : null
          }
          onMouseUp={
            selfId && curPlayer && selfId === curPlayer.id ? doneDrawing : null
          }
        ></canvas>
      </div>
    </div>
  );
};

export default DrawBox;
