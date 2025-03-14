import { Component } from "react";
import { Server, Login } from "./Logins/Logins";
import Setting from "./Settings/Settings";
import ChatCord from "./ChatCord/ChatCord";
import Balls from "./Balls/Balls";
class Access extends Component {
  constructor(probs) {
    super(probs);
    this.state = { server: false, login: false };
  }

  componentDidMount() {
    Setting.server = (prob) => {
      this.setState({ server: prob });
    };
    Setting.login = (prob) => {
      this.setState({ login: prob });
    };
  }

  render() {
    return (
      <>
        <Balls />
        {this.state.server == false ? (
          <Server />
        ) : (
          <>{this.state.login == false ? <Login /> : <ChatCord />}</>
        )}
      </>
    );
  }
}

export default Access;
