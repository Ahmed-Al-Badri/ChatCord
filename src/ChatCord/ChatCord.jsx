import React from "react";
import { Component } from "react";
import Setting from "../Settings/Settings";
import "./Stlye/ChatCord.css";
class ChatCord extends Component {
  constructor(prob) {
    super(prob);
  }

  render() {
    return (
      <div className="ChatCord">
        <div className="Top">
          <div className="Top2">Top data</div>
        </div>
        <div className="Body">
          <div className="Channels">
            <div className="Chats">
              <div className="Chat"></div>
              <Channels />
            </div>
          </div>
          <div className="InBody">
            <InBody />
          </div>
        </div>
      </div>
    );
  }
}

export default ChatCord;

class Channels extends Component {
  constructor(prob) {
    super(prob);
    this.state = {
      chats: [],
      brodes: [],
    };
  }

  componentDidMount() {
    Setting.get_all = (prob) => {
      this.setState({
        chats: prob.chats,
        brodes: prob.brodechats,
      });
    };
    Setting.Get_All();
  }

  render() {
    return (
      <>
        <div className="Chats">
          <div
            className="Chat"
            onClick={() => {
              Setting.InBody(undefined);
            }}
          >
            Chats
          </div>
          {this.state.brodes.map((res) => {
            return (
              <div
                className="Chat"
                onClick={() => {
                  Setting.InBody(res);
                }}
              >
                {res}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

class InBody extends Component {
  constructor(prob) {
    super(prob);
    this.state = { option: undefined };
  }

  componentDidMount() {
    Setting.InBody = (prob) => {
      this.setState({ option: prob });
    };
  }

  render() {
    return (
      <>
        {this.state.option == undefined ? (
          <Chats />
        ) : (
          <ChatChat key={this.state.option} chat_id={this.state.option} />
        )}
      </>
    );
  }
}

class Chats extends Component {
  constructor(probs) {
    super(probs);
    this.state = { chats: Setting.chats_ || [] };
    this.ChatName = "";
  }

  componentDidMount() {
    Setting.chats = (probs) => {
      this.setState({ chats: probs });
    };
    Setting.onusers.push(() => {
      this.setState({});
    });
  }

  handleCopyChatId(chatId) {
    navigator.clipboard
      .writeText(chatId)
      .then(() => {
        console.log(`Chat ID ${chatId} copied to clipboard!`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  }

  create() {
    if (this.ChatName !== undefined && this.ChatName !== "") {
      Setting.Create_Chat(this.ChatName);
      this.ChatName = "";
    }
  }

  join() {
    // Logic for joining a chat
    if (this.ChatName !== undefined && this.ChatName !== "") {
      Setting.Join_Chat(this.ChatName);
      this.ChatName = "";
    }
  }

  render() {
    const sortedChats = this.state.chats.sort((a, b) => {
      const lastMessageA =
        a.messages.length > 0 ? a.messages[a.messages.length - 1].timestamp : 0;
      const lastMessageB =
        b.messages.length > 0 ? b.messages[b.messages.length - 1].timestamp : 0;
      return lastMessageB - lastMessageA;
    });

    return (
      <div>
        <div className="ChatActions">
          <div className="ChatAction">
            <label htmlFor="create-chat-name">Create Chat:</label>
            <input
              id="create-chat-name"
              type="text"
              onChange={(prob) => {
                this.ChatName = prob.target.value;
              }}
            />
            <button onClick={() => this.create()}>Create</button>
          </div>
          <div className="ChatAction">
            <label htmlFor="join-chat-name">Join Chat:</label>
            <input
              id="join-chat-name"
              type="text"
              onChange={(prob) => {
                this.ChatName = prob.target.value;
              }}
            />
            <button onClick={() => this.join()}>Join</button>
          </div>
        </div>

        <div className="ChatBase">
          {sortedChats.map((chat) => {
            const lastMessage =
              chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1]
                : null; // get the last message
            const lastMessageDate = lastMessage
              ? new Date(lastMessage.timestamp).toLocaleString()
              : "No messages yet"; // formating the date
            let username =
              chat.messages.length > 0
                ? Setting.Get_User(
                    chat.messages[chat.messages.length - 1].userId
                  )
                : "";
            return (
              <div
                key={chat.chat_id}
                onClick={() => {
                  console.log(chat.chat_id);
                  Setting.InBody(chat.chat_id);
                }}
                className="ChatItem"
              >
                <div className="ChatHeader">
                  <strong>{chat.chat_name}</strong>
                </div>
                {lastMessage ? (
                  <div className="ChatBody">
                    <div className="LastMessage">
                      <span>{lastMessage.userId}: </span>{" "}
                      <span>{lastMessage.message}</span>{" "}
                      <span className="LastMessageDate">
                        {" "}
                        - {lastMessageDate}
                      </span>{" "}
                    </div>
                  </div>
                ) : (
                  <div className="ChatBody">
                    <span>No messages yet</span>{" "}
                  </div>
                )}
                <button
                  className="CopyButton"
                  onClick={() => this.handleCopyChatId(chat.chat_id)}
                >
                  Copy
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

class ChatChat extends Component {
  constructor(prob) {
    super(prob);
    this.state = {
      chat_data: {},
      message: "",
      urlPreviews: [],
    };
    this.chat_id = prob.chat_id;
    this.messagesEndRef = React.createRef();
  }

  componentDidMount() {
    Setting.focus_chat = this.chat_id;
    Setting.Chat_effect = (prob) => {
      this.setState({ chat_data: prob }, () => {
        this.scrollToBottom();
      });
    };
    Setting.Get_Chat(this.chat_id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.chat_data.messages !== this.state.chat_data.messages) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    if (this.messagesEndRef.current) {
      this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  onsend() {
    if (this.state.message.trim() !== "") {
      const newMessage = {
        message: this.state.message,
        timestamp: new Date().toISOString(),
        userId: "currentUserId",
      };

      Setting.Send_Message(this.chat_id, newMessage);
      this.setState({ message: "", urlPreviews: [] });
    }
  }

  handleInputChange = (event) => {
    const message = event.target.value;
    this.setState({ message });

    // Regex to match URLs for images and videos
    this.setState({
      urlPreviews: this.extractMediaUrls(message),
    });
  };

  extractMediaUrls(message) {
    const urls = message.match(/(https?:\/\/[^\s]+)/g) || [];
    const previews = urls.filter(
      (url) => this.isImage(url) || this.isVideo(url)
    );
    return previews;
  }

  renderMessages() {
    const { chat_data } = this.state;

    return (
      <div className="MessagesList_forchat">
        {chat_data.messages &&
          chat_data.messages.map((msg, index) => (
            <div key={index} className="MessageItem_forchat">
              <span className="MessageUser_forchat">{msg.userId}:</span>
              {msg.message.startsWith("http") ? (
                <a href={msg.message} target="_blank" rel="noopener noreferrer">
                  {this.isImage(msg.message) ? (
                    <img
                      src={msg.message}
                      alt="User sent content"
                      className="MessageImage_forchat"
                    />
                  ) : this.isVideo(msg.message) ? (
                    <video controls className="MessageVideo_forchat">
                      <source src={msg.message} type="video/mp4" />
                      <source src={msg.message} type="video/ogg" />
                      <source src={msg.message} type="video/webm" />
                    </video>
                  ) : (
                    msg.message
                  )}
                </a>
              ) : (
                <span>{msg.message}</span>
              )}
            </div>
          ))}
        {/* Anchor for scrolling */}
        <div ref={this.messagesEndRef} />
      </div>
    );
  }

  isImage(url) {
    return url.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/) !== null;
  }

  isVideo(url) {
    return url.match(/\.(mp4|mov|avi|wmv|m4v|ogg|webm)$/) !== null;
  }

  renderUrlPreviews() {
    const { urlPreviews } = this.state;

    return (
      <div className="UrlPreviewsContainer_forchat">
        {urlPreviews.map((url, index) =>
          this.isImage(url) ? (
            <img
              key={index}
              src={url}
              alt="URL preview"
              className="UrlImagePreview_forchat"
            />
          ) : this.isVideo(url) ? (
            <video key={index} controls className="UrlVideoPreview_forchat">
              <source src={url} type="video/mp4" />
              <source src={url} type="video/ogg" />
              <source src={url} type="video/webm" />
            </video>
          ) : null
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="ChatContainer_forchat">
        <div className="ChatHeader_forchat">
          <h2>{this.state.chat_data.chat_name}</h2>
        </div>
        <div className="ChatBody_forchat">{this.renderMessages()}</div>
        <div className="ChatInputContainer_forchat">
          {this.renderUrlPreviews()}
          <textarea
            value={this.state.message}
            onChange={this.handleInputChange}
            placeholder="Type your message here..."
            className="ChatInput_forchat"
            rows="3"
          />
          <button onClick={() => this.onsend()} className="SendButton_forchat">
            Send
          </button>
        </div>
      </div>
    );
  }
}

//ChatBase res contain is {chat_name: "AA", chat_id:"12", messages: [], users: ["this_user", "etc"]}
