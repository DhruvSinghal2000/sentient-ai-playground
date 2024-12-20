"use client";

import { v4 as uuid } from "uuid";
import { useChat } from "ai/react";
import * as React from "react";
import { Chatbox } from "../chatbox";
import { UserMessageInput } from "../user-message-input";
import { ChatsHistory } from "../chats-history";
import { IChatHistory, IChatMessage } from "@/types";
import { useIndexDbContext } from "@/context";

/**
 * Entry to the chat bot experience, it is the parent component holding the conversation history sidebar , the chat box and the input box.
 */
export const Playground = () => {
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isLoadingResponse,
  } = useChat();

  /**
   * Retrieve functions to update the chats history and get conversation for a given id
   */
  const { updateChatsHistory, getConversationForId } = useIndexDbContext();

  /**
   * State that tells if the previous chat is being loaded from the indexDB
   */
  const [isLoadingSavedChat, setIsLoadingSavedChat] =
    React.useState<boolean>(false);

  /**
   * Current active chat id
   */
  const [chatId, setSelectedChatId] = React.useState<string | undefined>(
    undefined
  );

  /**
   * Ref that holds all the information about currently active chat
   */
  const selectedChat = React.useRef<IChatHistory | undefined>(undefined);

  /**
   * If the chatId changes and is not undefined (either user saved a new chat, or used the side bar to load a previous conversation), we want to fetch the
   * related chat.
   *
   * If the chatId changes to undefined, we will set the messages as an empty array and selectChat as undefined
   */
  React.useEffect(() => {
    if (!!chatId) {
      setIsLoadingSavedChat(true);
      const getChat = async () => await getConversationForId(chatId);
      getChat().then((chat) => {
        selectedChat.current = chat;
        if (!!chat) {
          setMessages(chat.conversation);
          setIsLoadingSavedChat(false);
        }
      });
    } else {
      setMessages([]);
      selectedChat.current = undefined;
    }
  }, [chatId, setMessages, setIsLoadingSavedChat]);

  const className = React.useMemo(() => {
    return isLoadingSavedChat || !messages || !messages.length
      ? `justify-center`
      : "justify-between";
  }, [isLoadingSavedChat, messages]);

  /**
   * Callback to handle chat save event.
   * Prompts the user to enter the title for the conversation if it is being saved for the first time.
   * If it is not the first time, chat data is updated and saved to indexDB
   */
  const onChatSave = React.useCallback(() => {
    let chatUpdate;

    if (!selectedChat.current) {
      const title = prompt(
        "Enter chat title",
        `Chat - ${new Date().toLocaleTimeString()}`
      );
      if (!title) {
        console.error("Chat title is required to save!");
        return;
      }
      /**
       * Assign a new id, updates createdAt, updatedAt time with current time.
       */
      chatUpdate = {
        id: uuid(),
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        title,
        conversation: messages,
      };
      setSelectedChatId(chatUpdate.id);
    } else {
      /**
       * If selectedChat is already set that means chat was saved previously once, thus only update the
       * conversation messages and last updated time
       */
      chatUpdate = {
        ...selectedChat.current,
        conversation: messages,
        updatedAt: new Date().getTime(),
      };
    }

    updateChatsHistory(chatUpdate);
    console.error(`Chat "${chatUpdate.title}" has been saved successfully!`);
  }, [messages, updateChatsHistory]);

  return (
    <div className="flex flex-row w-full h-full">
      <ChatsHistory chatId={chatId} setSelectedChatId={setSelectedChatId} />
      <div
        className={`flex flex-col items-center gap-3 grow lg:w-4/5 sm:w-fit ${className} pt-24 pb-10 mx-auto`}
      >
        <Chatbox isLoadingSavedChats={isLoadingSavedChat} messages={messages} />
        <UserMessageInput
          isLoadingResponse={isLoadingResponse}
          onChatSave={onChatSave}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
