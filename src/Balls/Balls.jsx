import React, { Component } from "react";
import "./Style/Style.css";
const ball = {
  loc: [0, 0],
  speed: [1, 2],
  size: 20,
};

class Balls extends Component {
  constructor() {
    super();
    this.state = {
      wid: window.innerWidth,
      hig: window.innerHeight,
      ref: React.createRef(),
    };

    this.balls = [];
    this.amount = 60;
    this.color = "#3498DB";

    for (let i = 0; i < this.amount; i++) {
      this.balls.push({
        loc: [
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
        ],
        speed: [Math.random() * 2 - 1, Math.random() * 2 - 1],
        size: Math.random() * 20 + 5,
        history: [],
        history1: [],
        history2: [],
      });
    }

    this.mainBall = {
      loc: [0, 0],
      size: 20,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("mousemove", this.handleMouseMove);
    if (this.state.ref.current) {
      this.run();
    }
  }

  handleResize = () => {
    this.setState({ wid: window.innerWidth, hig: window.innerHeight });
  };

  handleMouseMove = (event) => {
    this.mainBall.loc = [event.clientX, event.clientY];
  };

  run = () => {
    const ctx = this.state.ref.current.getContext("2d");
    ctx.clearRect(0, 0, this.state.wid, this.state.hig);

    // drawing
    ctx.beginPath();
    ctx.arc(
      this.mainBall.loc[0],
      this.mainBall.loc[1],
      this.mainBall.size,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    this.balls.forEach((ball, index) => {
      ball.loc[0] += ball.speed[0];
      ball.loc[1] += ball.speed[1];
      ball.history.push([...ball.loc]);

      if (ball.history.length > 85) {
        ball.history.shift();
      }

      // This is for the walls etc.
      if (
        ball.loc[0] + ball.size > this.state.wid ||
        ball.loc[0] - ball.size < 0
      ) {
        ball.speed[0] = -ball.speed[0];
      }
      if (
        ball.loc[1] + ball.size > this.state.hig ||
        ball.loc[1] - ball.size < 0
      ) {
        ball.speed[1] = -ball.speed[1];
      }

      // checking collections for other balls

      for (let j = 0; j < this.balls.length; j++) {
        if (index !== j) {
          const dx = ball.loc[0] - this.balls[j].loc[0];
          const dy = ball.loc[1] - this.balls[j].loc[1];
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = ball.size + this.balls[j].size;

          if (distance < minDistance) {
            const overlap = minDistance - distance;
            const angle = Math.atan2(dy, dx);

            ball.loc[0] += Math.cos(angle) * (overlap / 2);
            ball.loc[1] += Math.sin(angle) * (overlap / 2);
            this.balls[j].loc[0] -= Math.cos(angle) * (overlap / 2);
            this.balls[j].loc[1] -= Math.sin(angle) * (overlap / 2);
          }
        }
      }

      const dx = ball.loc[0] - this.mainBall.loc[0];
      const dy = ball.loc[1] - this.mainBall.loc[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = ball.size + this.mainBall.size;

      if (distance < minDistance) {
        const overlap = minDistance - distance;
        const angle = Math.atan2(dy, dx);

        ball.loc[0] += Math.cos(angle) * (overlap / 2);
        ball.loc[1] += Math.sin(angle) * (overlap / 2);
        this.mainBall.loc[0] -= Math.cos(angle) * (overlap / 2);
        this.mainBall.loc[1] -= Math.sin(angle) * (overlap / 2);
      }

      ctx.strokeStyle = this.color;
      ctx.beginPath();
      if (ball.history.length > 1) {
        for (let i = 0; i < ball.history.length; i++) {
          const [x, y] = ball.history[i];
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.closePath();

      const angle = Math.atan2(ball.speed[1], ball.speed[0]);

      //
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      if (ball.history.length > 1) {
        for (
          let i = Math.floor(ball.history.length / 2);
          i < ball.history.length;
          i++
        ) {
          const [x, y] = ball.history[i];
          ctx.lineTo(
            x + ball.size * Math.cos(angle + Math.PI / 2),
            y + ball.size * Math.sin(angle + Math.PI / 2)
          );
        }
      }
      ctx.stroke();
      ctx.closePath();

      ctx.strokeStyle = this.color;
      ctx.beginPath();
      if (ball.history.length > 1) {
        for (
          let i = Math.floor(ball.history.length / 2);
          i < ball.history.length;
          i++
        ) {
          const [x, y] = ball.history[i];
          ctx.lineTo(
            x + ball.size * Math.cos(angle - Math.PI / 2),
            y + ball.size * Math.sin(angle - Math.PI / 2)
          );
        }
      }
      ctx.stroke();
      ctx.closePath();

      //

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(ball.loc[0], ball.loc[1], ball.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    });

    requestAnimationFrame(this.run);
  };

  render() {
    return (
      <div className="Balls">
        <canvas
          height={this.state.hig}
          width={this.state.wid}
          ref={this.state.ref}
        />
      </div>
    );
  }
}

export default Balls;
