import React, { Component } from "react";
import "./Style/Style.css";
const ball = {
  loc: [0, 0],
  speed: [1, 2],
  size: 20, // Default radius for mouse cursor ball
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
    this.amount = 60; // Number of balls
    this.color = "#803060";

    // Initialize multiple balls with random properties
    for (let i = 0; i < this.amount; i++) {
      this.balls.push({
        loc: [
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
        ],
        speed: [
          Math.random() * 2 - 1, // Speed can be negative or positive
          Math.random() * 2 - 1,
        ],
        size: Math.random() * 20 + 5, // Random radius between 5 and 25
        history: [], // To store previous positions for trailing effect
      });
    }

    this.mainBall = {
      loc: [0, 0],
      size: 20, // Size of mouse ball
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("mousemove", this.handleMouseMove);
    this.run();
  }

  handleResize = () => {
    this.setState({ wid: window.innerWidth, hig: window.innerHeight });
  };

  handleMouseMove = (event) => {
    // Update the main ball's location to the mouse's position
    this.mainBall.loc = [event.clientX, event.clientY];
  };

  run = () => {
    const ctx = this.state.ref.current.getContext("2d");
    ctx.clearRect(0, 0, this.state.wid, this.state.hig);

    // Draw the main mouse ball
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
      // Update ball's position
      ball.loc[0] += ball.speed[0];
      ball.loc[1] += ball.speed[1];

      // Store the current position in history for trailing effect
      ball.history.push([...ball.loc]);

      // Keep the history length to a reasonable size (e.g., 10 positions)
      if (ball.history.length > 100) {
        ball.history.shift(); // Remove the oldest position
      }

      // Collision with walls
      if (
        ball.loc[0] + ball.size > this.state.wid ||
        ball.loc[0] - ball.size < 0
      ) {
        ball.speed[0] = -ball.speed[0]; // Reverse speed on X-axis
      }
      if (
        ball.loc[1] + ball.size > this.state.hig ||
        ball.loc[1] - ball.size < 0
      ) {
        ball.speed[1] = -ball.speed[1]; // Reverse speed on Y-axis
      }

      // Collision with other balls
      for (let j = 0; j < this.balls.length; j++) {
        if (index !== j) {
          const dx = ball.loc[0] - this.balls[j].loc[0];
          const dy = ball.loc[1] - this.balls[j].loc[1];
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = ball.size + this.balls[j].size;

          if (distance < minDistance) {
            // Separate overlapping balls
            const overlap = minDistance - distance;
            const angle = Math.atan2(dy, dx);

            // Push the balls apart
            ball.loc[0] += Math.cos(angle) * (overlap / 2);
            ball.loc[1] += Math.sin(angle) * (overlap / 2);
            this.balls[j].loc[0] -= Math.cos(angle) * (overlap / 2);
            this.balls[j].loc[1] -= Math.sin(angle) * (overlap / 2);
          }
        }
      }

      // Collision with the main mouse ball
      const dx = ball.loc[0] - this.mainBall.loc[0];
      const dy = ball.loc[1] - this.mainBall.loc[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = ball.size + this.mainBall.size;

      if (distance < minDistance) {
        // Separate main ball and other balls
        const overlap = minDistance - distance;
        const angle = Math.atan2(dy, dx);

        // Push the balls apart
        ball.loc[0] += Math.cos(angle) * (overlap / 2);
        ball.loc[1] += Math.sin(angle) * (overlap / 2);
        this.mainBall.loc[0] -= Math.cos(angle) * (overlap / 2);
        this.mainBall.loc[1] -= Math.sin(angle) * (overlap / 2);
      }

      // Draw the ball's trail (lines from previous positions)
      ctx.strokeStyle = this.color; // Set the color for the trail
      ctx.beginPath();
      if (ball.history.length > 1) {
        for (let i = 0; i < ball.history.length; i++) {
          const [x, y] = ball.history[i];
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.closePath();

      // Draw the ball
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(ball.loc[0], ball.loc[1], ball.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    });

    // Continue the animation
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
