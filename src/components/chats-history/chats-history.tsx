"use client";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import CreateIcon from "@mui/icons-material/Create";
import * as React from "react";

import { useIndexDbContext } from "@/context";
import { PartialChatHistory } from "@/types";

export interface IChatsHistoryProps {
  /**
   * Id of the current chat opened
   */
  chatId?: string;
  /**
   * React setState call to set the active chat ID
   */
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

/**
 * Component to display the past saved conversation with the bot.
 */
export const ChatsHistory: React.FC<IChatsHistoryProps> = ({
  chatId,
  setSelectedChatId,
}: IChatsHistoryProps) => {
  /**
   * State to store whether the side bar is expanded or not
   */
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  /**
   * Array that contains partial information of all the previous conversation fetched from the indexDB
   */
  const [allChats, setAllChats] = React.useState<PartialChatHistory[]>();
  const { getPartialConversationDetails } = useIndexDbContext();

  /**
   * Only if the sidebar is expanded we need to fetch the chatHistory
   */
  React.useEffect(() => {
    if (isExpanded) {
      const getHistory = async () => {
        return await getPartialConversationDetails();
      };
      getHistory().then((val) => setAllChats(val));
    }
  }, [chatId, isExpanded, getPartialConversationDetails]);

  /**
   * Callback to handle the request to start a new conversation
   * Set's the selected chat Id to undefined which is the initial load state
   */
  const startNewChat = React.useCallback(() => {
    setSelectedChatId(undefined);
  }, [setSelectedChatId]);

  /**
   * Callback to handle selection of any of the past conversations.
   * Updates the current chatId.
   */
  const onChatClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const id = (event.target as HTMLLIElement).getAttribute("data-id");
      console.log(`Opening chat with id ${id}`);
      if (!!id && id !== chatId) {
        setSelectedChatId(id);
      }
    },
    [chatId, setSelectedChatId]
  );

  /**
   * Creates a record of Conversation grouped based on their last updated time.
   * Conversation last updated today is displayed under the "Today" group , everything else is "Earlier"
   */
  const groupedChats = React.useMemo(() => {
    const grouped: Record<string, PartialChatHistory[]> = {};
    allChats?.forEach((chat) => {
      if (chat.updatedAt) {
        const group =
          new Date(chat.updatedAt).toDateString() === new Date().toDateString()
            ? "Today"
            : "Earlier";
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(chat);
      }
    });
    return grouped;
  }, [allChats]);

  const onToggleSideBar = React.useCallback(() => {
    setIsExpanded((curr) => !curr);
  }, [setIsExpanded]);

  return !isExpanded ? (
    <div className="pl-2 pt-2" onClick={onToggleSideBar}>
      <MenuIcon />
    </div>
  ) : (
    <div className="px-2 pt-2 w-1/10 justify-between overflow-x-hidden text-ellipsis bg-[var(--secondaryBackground)]">
      <div className="flex justify-between">
        <button onClick={onToggleSideBar}>
          <CloseIcon />
        </button>
        <button onClick={startNewChat}>
          <CreateIcon />
        </button>
      </div>

      <div onClick={onChatClick}>
        {Object.entries(groupedChats).map(([group, chats]) => (
          <React.Fragment key={group}>
            <h3 className="font-bold text-sm mt-4">{group}</h3>
            <ul>
              {chats.map((chat) => (
                <li
                  data-id={chat.id}
                  key={chat.id}
                  className="text-xs cursor-pointer hover:underline"
                >
                  {chat.title || "Untitled Chat"}
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
