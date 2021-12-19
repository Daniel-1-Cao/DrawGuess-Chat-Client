import io from "socket.io-client";
const ENDPOINT = "https://react-chat-drawguess-app.herokuapp.com/";
const socket = io(ENDPOINT);
export default socket;
