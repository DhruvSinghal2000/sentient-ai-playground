import * as React from "react";

import { IChatMessage } from "@/types";

import { Loading } from "../loading";
import { Message } from "../message";

export interface IChatBoxProps {
  /**
   * Message history
   */
  messages?: IChatMessage[];
  /**
   * Flag to control if the Loading dots should display
   */
  isLoadingSavedChats: boolean;
}

/**
 * Container that contains the messages in the conversation.
 * If the chats are loading a Loading icon is show.
 * Right side messages are from the user and left from the bot.
 */
const Chatbox: React.FC<IChatBoxProps> = React.memo(
  ({ messages, isLoadingSavedChats }: IChatBoxProps) => {
    return isLoadingSavedChats ? (
      <Loading />
    ) : !!messages && !!messages.length ? (
      <div className="w-full flex justify-center overflow-y-auto scheme-dark">
        <div className="grid gap-4 w-3/5 ">
          {messages.map((message, idx) => (
            <Message
              key={`${idx}-${message.createdAt?.toLocaleTimeString()}`}
              message={message}
            />
          ))}
        </div>
      </div>
    ) : (
      <div className="color-[var(--foreground)] text-3xl text-center">
        What can I help you with?
      </div>
    );
  }
);
Chatbox.displayName = "ChatBox"; 

export { Chatbox }; 