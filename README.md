## ChatCord

> ChatCord is an application that uses React and websockets to enable real-time communication among users. [Link to ChatCord Frontend Repo](https://github.com/Ahmed-Al-Badri/ChatCord)

## Server

> To run the server, execute the following command: node ./ChatCord.js. The server is configured to run on port 8081 by default, but you can change it to any address if necessary. [Link to Server Repo](https://github.com/Ahmed-Al-Badri/ServerData)

## Review Video

> A video reviewing how to use the ChatCord app. [Video Link](https://pdx.zoom.us/rec/share/lIOe1ojBm--GwPj9rKwMLR78NWXJRUHrvsuZi9vNwYcC7EpLJKOqKDAAhb55eYzU.hZzRO5EegtPE3KpE?startTime=1741649543000)

## Setup

> To use this application, you will need to set up a websocket to manage the data flow between clients and the server, primarily for controlling chat functionalities.

Running the Server

1. Open your command line.
2. Navigate to the server directory.
3. Use the following command to start the server: node ./ChatCord.js [args for port and host].

Running the Frontend

1. Start by installing the required packages: npm install.
2. To run the application, use the following command: npm run dev -- --host [to expose the Internet Protocol address].

## Frontend Details

> To develop the ChatCord communication protocols effectively, we needed a flexible structure that would allow continued expansion as the project evolves. Instead of relying heavily on routing, which can be resource-intensive if not done correctly, this approach leverages React's capabilities.

> React's component lifecycle and rendering behaviors allow for dynamic component management, similar to how objects are managed in C++. It provides a more efficient method to handle events, reducing the complexity associated with traditional HTML/JavaScript event listeners.

## Frontend Features

- Login: Users can securely save their hashed passwords for login.
- Create Account: New users can create accounts with hashed data for security.
- Create Chat: Users can create chats with unique names and different contents.
- Join Chat: Users can join chats using the chat ID.
- View Chats: Option to copy the chat ID easily, ability to leave a chat, display the last message with user/date information.
- Chat Interface: Users can see their profile image alongside messages, support for viewing both images and videos, and a cleaner, user-friendly interface for message viewing.
- Additional Features: Users can customize their experience by changing their username, profile image, theme color, and more.
