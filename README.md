# Sentient GPT 
This repository contains a lightweight AI chatbot application built using the Vercel AI SDK. The app allows users to engage in conversations with an AI bot and saves the chat history locally using IndexedDB for persistence. It's designed for seamless, real-time interactions with the ability to revisit previous conversations.

## Features Implemented
- Ability to chat with an open source AI bot (gemini-1.5-flash) , leverages the Vercel AI SDK for intelligent responsive chat interactions
- Utilizes IndexedDB to store conversations directly in the user's browser, ensuring privacy and offline access.
- Allows users to save and load conversations for later reference.
- Smooth real-time chat updates powered by React.

## Tech Stack
- **Language**: Typescipt
- **Frontend Framework**:  NextJs (built on top of React)
- **Package Manager**: NPM
- **Client Side Database**: IndexedDB (via Browser API) 
- **Styling**: Tailwind CSS

## Getting Started

1. **Clone the repository**: 
```bash
  git clone 
  cd <repository-folder> 
```

2. **Install Dependencies**
```bash
  npm install
``` 

3. **Run the Application**
```bash
npm run dev
```

4. **Open in Browser**

  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Possible upgrades
- **Implement Cursor-Based Pagination**: Add pagination to the chat interface to load previous messages efficiently, using timestamps as cursors for navigation.
- **Enhance Offline Support**: Utilize service workers to enable offline functionality, allowing users to chat with the AI and access saved conversations without an internet connection.
- **Add Code Syntax Highlighting:**: Improve user experience by enabling syntax highlighting for code snippets shared in the chat.
- **Unit Test Coverage**: Write unit tests to ensure robust functionality and catch potential issues early during development.
