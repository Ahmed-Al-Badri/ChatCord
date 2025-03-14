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
          <div
            onClick={() => {
              Setting.InBody(3);
            }}
            className="Chat"
          >
            Style
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
        ) : this.state.option == 3 ? (
          <>
            <Style_User />
          </>
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
        //console.log(`Chat ID ${chatId} copied to clipboard!`);
      })
      .catch((err) => {
        //console.error("Failed to copy: ", err);
      });
  }

  handleLeaveChat(chat_id) {
    Setting.Leave_Chat(chat_id);
  }

  create() {
    if (this.ChatName !== undefined && this.ChatName !== "") {
      Setting.Create_Chat(this.ChatName);
      this.ChatName = "";
    }
  }

  join() {
    if (this.ChatName !== undefined && this.ChatName !== "") {
      Setting.Join_Chat(this.ChatName);
      //console.log(this.ChatName);
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

            return (
              <div
                key={chat.chat_id}
                onClick={() => {
                  //console.log(chat.chat_id);
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
                      <span>
                        {Setting.users != undefined
                          ? Setting.users[lastMessage.userId].name ||
                            lastMessage.userId
                          : lastMessage.userId}
                        :{" "}
                      </span>{" "}
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
                  onClick={(prob) => {
                    prob.preventDefault();
                    prob.stopPropagation();
                    this.handleCopyChatId(chat.chat_id);
                  }}
                >
                  Copy
                </button>
                <button
                  onClick={(prob) => {
                    prob.stopPropagation();
                    this.handleLeaveChat(chat.chat_id);
                  }}
                  className="LeaveChat"
                >
                  Leave
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

  formatdate(dates) {
    let current = new Date();
    let date = new Date(dates);
    let year = date.getFullYear();
    if (year - current.getFullYear() != 0) {
      return (
        <div className="DateFormat">{`${date.getMonth()}/${date.getDate()}/${year} ${date.getHours()}:${date.getMinutes()}`}</div>
      );
    }
    let month = date.getMonth();
    if (month - current.getMonth() != 0) {
      return (
        <div className="DateFormat">{`${month}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`}</div>
      );
    }
    let day = date.getDate();
    if (day - current.getDate()) {
      return (
        <div className="DateFormat">{`On ${day}th ${date.getHours()}:${date.getMinutes()}`}</div>
      );
    }

    return (
      <div className="DateFormat">{`${date.getHours()}:${date.getMinutes()}`}</div>
    );
  }

  renderMessages() {
    const { chat_data } = this.state;
    let last_id = "";
    let similar = false;
    let indexs = 0;
    let dis = 0;

    return (
      <div className="MessagesList_forchat">
        {chat_data.messages &&
          chat_data.messages.map((msg, index) => {
            let urls = msg.message;
            urls = this.extractMediaUrls(urls);
            if (urls.length) {
              //console.log(urls);
            }
            if (last_id != msg.userId) {
              last_id = msg.userId;
              dis = 0;
              indexs++;
            }
            similar = chat_data.messages[index + 1];
            if (similar) {
              if (msg.userId == similar.userId) {
                similar = true;
              } else {
                similar = false;
              }
            } else {
              similar = false;
            }
            return (
              <div
                key={index}
                className={`MessageItem_forchat ${
                  similar == true ? "SimilarOut" : ""
                }  ${indexs % 2 == 1 ? "Odd" : ""}`}
              >
                <div className="ControlSides">
                  <div className="LeftSided">
                    {dis == 0 ? (
                      <>
                        <div className="ImageLocation">AA</div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div className="HoverDate">
                      {this.formatdate(msg.timestamp)}
                    </div>
                  </div>

                  <div className="SpecLeft">
                    {dis++ == 0 ? (
                      <>
                        <div className="TopName">
                          {Setting.users[msg.userId].name || msg.userId} --{" "}
                          {this.formatdate(msg.timestamp)}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div className="LeftSide"></div>
                    <div className="RightSide"></div>
                    <span>{msg.message}</span>
                    <div className="Displaying_Sets">
                      {urls.map((res, val) => {
                        return (
                          <>
                            {res.startsWith("http") ? (
                              <a
                                key={val}
                                href={res}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {this.isImage(res) ? (
                                  <img
                                    src={res}
                                    key={val}
                                    alt="User sent content"
                                    className="MessageImage_forchat"
                                  />
                                ) : this.isVideo(res) ? (
                                  <video
                                    key={val}
                                    controls
                                    className="MessageVideo_forchat"
                                  >
                                    <source src={res} type="video/mp4" />
                                    <source src={res} type="video/ogg" />
                                    <source src={res} type="video/webm" />
                                  </video>
                                ) : (
                                  <></>
                                )}
                              </a>
                            ) : (
                              <span>{res}</span>
                            )}
                          </>
                        );

                        ///aaaa
                      })}
                    </div>
                  </div>
                </div>

                {similar == true ? (
                  <>
                    <div className="line"></div>
                  </>
                ) : (
                  <></>
                )}

                {/*

                */}
              </div>
            );
          })}
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

class Style_User extends Component {
  constructor(prob) {
    super(prob);
    this.state = { style: Setting.style || undefined };
    Setting.Get_Style();
  }

  componentDidMount() {
    Setting.style_status = (prob) => {
      this.setState({ style: prob });
    };
  }

  render() {
    return (
      <>
        {this.state.style ? (
          <>{JSON.stringify(this.state.style)}</>
        ) : (
          <div
            onClick={() => {
              Setting.Get_Style();
            }}
          >
            Reload
          </div>
        )}
      </>
    );
  }
}

//ChatBase res contain is {chat_name: "AA", chat_id:"12", messages: [], users: ["this_user", "etc"]}
