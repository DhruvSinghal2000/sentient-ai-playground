"use client";

import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import { ChatRequestOptions } from "ai";
import * as React from "react";

export interface IUsedMessageInput {
  /**
   * Callback that handles the submition of user prompt
   */
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;

  /**
   * Callback that handles the change in user input
   */
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;

  /**
   * Current input(prompt) by the user.
   */
  input: string;

  /**
   * Callback triggered when the chat save option is triggered
   */
  onChatSave: () => void;

  /**
   * Flag that controls whether the bot's response is being loaded right now
   */
  isLoadingResponse: boolean;
}

/**
 * React component to display the input field, send button and save button.
 * Doesn't allow user to send any prompt while bot is loading the response.
 */
const UserMessageInput: React.FC<IUsedMessageInput> = React.memo(
  ({
    handleInputChange,
    handleSubmit,
    onChatSave,
    input,
    isLoadingResponse,
  }: IUsedMessageInput) => {
    const handleSubmitClick = React.useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSubmit();
      },
      [handleSubmit]
    );

    return (
      <form className="flex w-3/5" onSubmit={handleSubmitClick}>
        <input
          className="w-full bottom-0 p-2 rounded-l bg-[var(--foreground)] overflow-hidden focus-visible:outline-none text-[var(--background)]"
          value={input}
          placeholder="Message Sentient GPT ..."
          onChange={handleInputChange}
          disabled={isLoadingResponse}
        />
        <button
          type="submit"
          className="bg-[var(--foreground)] pr-2 text-[var(--background)]"
        >
          <SendIcon />
        </button>
        <button
          onClick={onChatSave}
          className="bg-[var(--foreground)] rounded-r pr-2 text-[var(--background)]"
        >
          <SaveIcon />
        </button>
      </form>
    );
  }
);
UserMessageInput.displayName = "UserMessageInput";

export { UserMessageInput };
