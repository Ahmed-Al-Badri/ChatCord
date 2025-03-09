let LOGINS = {
  username_email: sessionStorage.getItem("username_email") || "",
  password: sessionStorage.getItem("password") || "",
};

let CREATS = {
  name: "",
  username: "",
  email: "",
  password: "",
};

let SERVER = {
  style: sessionStorage.getItem("ws") || "ws", // Added default to ws
  address: sessionStorage.getItem("address") || "",
  port: sessionStorage.getItem("port") || "8081", // Default port
};

const CHATS = {
  chats: [],
  notification: [],
  brodechats: [],
};

class Settings {
  constructor() {
    this.server = () => {};
    this.login = () => {};
    this.get_all = () => {};
    this.chats = () => {};
    this.users = {};
    this.WebS = undefined;
    this.logged = false;
    this.focus_chat = undefined;
    this.reference = sessionStorage.getItem("ref") || "";
    //this.chats = [];
    this.brodechats = [];
    this.InBody = () => {};
    this.onusers = [];
    try {
      this.Server();
      this.Logins();
    } catch (e) {}
  }

  Server(prob = SERVER) {
    sessionStorage.setItem("ws", prob.style);
    sessionStorage.setItem("address", prob.address);
    sessionStorage.setItem("port", prob.port);
    SERVER = prob;
    this.reconnectWebSocket();
  }

  Logins(prob = LOGINS) {
    sessionStorage.setItem("username_email", prob.username_email);
    sessionStorage.setItem("password", prob.password);
    LOGINS = prob;
    if (this.logged) {
      this.reconnectWebSocket(); // Create the WebSocket after login
      this.logged = false;
    }
    console.log(prob);
    this.send({ type: "login", args: [prob.username_email, prob.password] });
  }

  Creats(prob = CREATS) {
    //sessionStorage.setItem("username", prob.username);
    sessionStorage.setItem("email", prob.email);
    sessionStorage.setItem("password", prob.password);
    CREATS = prob;
    console.log(prob);
    console.log("create login");
    if (this.logged) {
      this.reconnectWebSocket(); // Create the WebSocket after account creation
      this.logged = false;
    }
    this.send({
      type: "create_account",
      args: [prob.email, prob.username, prob.password, prob.name],
    });
  }

  Join_Chat(chat_id) {
    this.send({ type: "join_chat", args: [this.reference, chat_id] });
  }

  reconnectWebSocket(prob = SERVER) {
    if (this.WebS) {
      this.WebS.close(); // Close existing connection if any
    }

    this.WebS = new WebSocket(`${prob.style}://${prob.address}:${prob.port}`);
    this.WebS.onopen = () => {
      this.server(true);
      console.log("WebSocket connection established.");
    };

    this.WebS.onmessage = (event) => {
      const response = JSON.parse(event.data);
      this.handleServerResponse(response);
    };

    this.WebS.onclose = () => {
      this.server(false);
    };

    this.WebS.onerror = () => {
      this.server(false);
    };
  }

  handleServerResponse(response) {
    if (response == "Close") {
      this.WebS.close();
      return;
    }
    // Handle server responses here
    // For example, you might want to distinguish based on response type
    switch (response.type) {
      case "login":
        if (response.status === 1) {
          sessionStorage.setItem("ref", response.response.user.reference);
          console.log(response);
          this.reference = response.response.user.reference;
          console.log("the ref given from the server is " + this.reference);
          this.login(true);
          console.log("Login successful.", response.data);
        } else {
          this.login(false);
          console.log("Login failed.", response.response);
        }
        break;
      case "create_account":
        if (response.status === 1) {
          sessionStorage.setItem("ref", response.response.user.reference);
          this.reference = response.response.user.reference;
          console.log(response);
          this.login(true);
          console.log("Account created successfully.", response.data);
        } else {
          this.login(false);
          console.log("Account creation failed.", response.response);
        }
        break;
      case "get_all":
        console.log(response);
        if (response.status === 1) {
          console.log(response);
          this.gel_all_ = response.response;
          //this.chats = this.gel_all_.chats;
          this.chats(this.gel_all_.chats);
          this.brodechats = this.gel_all_.brodechats;
          this.chats_ = this.gel_all_.chats;
          this.get_all(response.response);
        } else {
          console.warn("Getall failed");
        }
        break;
      case "user_info":
        if (response.status === 1) {
          this.users[response.user_id] = response.user_name;
          this.onusers.map((res) => res());
        }
        break;
      case "get_chat":
        console.log("send chat");
        //console.log(response);
        if (response.status === 1) {
          console.log("chat");
          console.log("focus" + this.focus_chat);
          console.log("the res" + response.chat_id);
          if (this.focus_chat == response.chat_id) {
            this.Chat_effect(response.chat);
          }
        }
      // Other response types can be handled accordingly
      default:
        console.log(response);
        console.warn("Unknown response type received.");
        break;
    }
  }

  Get_All() {
    this.send({
      type: "get_all",
      args: [this.reference],
    });
  }

  Create_Chat(prob) {
    this.send({
      type: "create_chat",
      args: [this.reference, prob],
    });
  }

  Get_User(prob) {
    if (this.users[prob] == undefined) {
      this.send({ type: "user_info", args: [prob] });
      return prob;
    }
    return this.users[prob];
  }

  Get_Chat(prob) {
    this.send({ type: "get_chat", args: [this.reference, prob] });
  }

  Send_Message(chat_id, message) {
    this.send({
      type: "send_to_chat",
      args: [this.reference, chat_id, message.message],
    });
  }

  async send(prob = {}) {
    if (this.WebS.readyState) {
      this.WebS.send(JSON.stringify(prob));
    } else {
      setTimeout(() => {
        this.send(prob);
      }, 0.25);
    }
  }
}

const Setting = new Settings();

export default Setting;
