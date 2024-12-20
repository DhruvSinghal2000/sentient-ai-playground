import parse from "html-react-parser";
import { marked } from "marked";
import * as React from "react";

import { Author, IChatMessage } from "@/types";

export interface IMessageProps {
  /**
   * Message to be displayed
   */
  message: IChatMessage;
}

/**
 * Component to display the message correctly formatted based on author type
 */
export const Message: React.FC<IMessageProps> = ({
  message,
}: IMessageProps) => {
  const containerClassname = React.useMemo(() => {
    return `${
      message.role !== Author.Assistant
        ? "flex w-fit justify-end rounded-full bg-[var(--messageBackground)] px-5 py-1 ml-auto"
        : "w-4/5"
    }`;
  }, [message]);

  return (
    <div className={containerClassname}>
      {parse(marked(message.content, { async: false }))}
    </div>
  );
};
