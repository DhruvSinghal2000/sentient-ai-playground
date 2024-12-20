"use client";

import { CHATS_HISTORY_DB, CHATS_HISTORY_STORE } from "@/constants";
import { IndexDBContext } from "@/context";
import { IChatHistory, PartialChatHistory } from "@/types";
import * as React from "react";

/**
 * High order component to provide indexDB utility function through React context.
 */
export const IndexdbProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  /**
   * State that holds the instance of indexDB
   */
  const [db, setDb] = React.useState<IDBDatabase | null>(null);

  /**
   * On mount of this provider component, we intialize the dp and get its first version.
   */
  React.useEffect(() => {
    const request: IDBOpenDBRequest = indexedDB.open(CHATS_HISTORY_DB, 1);

    request.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
      const tempDb = (ev.target as IDBRequest<IDBDatabase>).result;
      if (!tempDb?.objectStoreNames.contains(CHATS_HISTORY_STORE)) {
        const objectStore = tempDb?.createObjectStore(CHATS_HISTORY_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });

        /**
         * Storing conversation id , creation time, last updated time, title and all the messages in the conversation
         */
        objectStore.createIndex("id", "id", { unique: true });
        objectStore.createIndex("createdAt", "createdAt", { unique: true });
        objectStore.createIndex("updatedAt", "updatedAt", { unique: true });
        objectStore.createIndex("title", "title", { unique: true });
        objectStore.createIndex("conversation", ["timestamp"], {
          unique: true,
        });
      }
    };

    request.onsuccess = (ev: Event) => {
      setDb((ev.target as IDBRequest<IDBDatabase>).result);
      console.log("Database opened successfully:", request.result);
    };

    request.onerror = () => {
      console.error("Database error:", request.error);
    };
  }, []);

  /**
   * Adds the given conversation to the indexDB store
   * @param conversation conversation to be added
   */
  const updateChatsHistory = (conversation: IChatHistory | undefined) => {
    if (!!conversation) {
      const transaction = db?.transaction(CHATS_HISTORY_STORE, "readwrite");

      if (transaction) {
        const store = transaction.objectStore(CHATS_HISTORY_STORE);
        const request = store.get(conversation.id);

        request.onsuccess = () => {
          const exists = request.result;

          if (exists) {
            const updateRequest = store.put(conversation);
            updateRequest.onsuccess = () =>
              console.log(
                `conversation with id ${conversation.id} updated successfully`
              );
            updateRequest.onerror = () =>
              console.log(
                `conversation with id ${conversation.id} not updated successfully`
              );
          } else {
            const addReq = store.add(conversation);
            addReq.onsuccess = () =>
              console.log(
                `conversation with id ${conversation.id} added successfully`
              );
            addReq.onerror = () =>
              console.log(
                `conversation with id ${conversation.id} not added successfully`
              );
          }
        };
      }
    } else {
      console.log("No chat histroy  provided");
    }
  };

  /**
   * Fetches the conversation for the given id from the indexDB store
   * @param id id for which conversation needs to be fetched
   */
  const getConversationForId = (
    id?: string
  ): Promise<IChatHistory | undefined> => {
    if (!id) {
      console.error("No id provided while fetching chat history");
      return Promise.reject("No id provided while fetching chat history");
    }
    const transaction = db?.transaction(CHATS_HISTORY_STORE, "readwrite");
    if (transaction) {
      let conversation: IChatHistory | undefined;
      const request: IDBRequest<IChatHistory> = transaction
        .objectStore(CHATS_HISTORY_STORE)
        .get(id);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          conversation = request.result;
          console.log(
            `Retrieved conversation ${JSON.stringify(
              conversation
            )} history successfully for id ${id}!`
          );
          resolve(conversation);
        };
        request.onerror = () => {
          console.error(
            `Error retrieving conversation for ${id} with error ${request.error}`
          );
          reject(request.error);
        };
      });
    } else {
      console.error("Error retrieving chat history");
      return Promise.reject(`Couldn't start a transaction with the DB`);
    }
  };

  /**
   * Retrieves all the user conversation but only a part of the details like id title and last updated at
   */
  const getPartialConversationDetails = (): Promise<PartialChatHistory[]> => {
    const transaction = db?.transaction(CHATS_HISTORY_STORE, "readwrite");
    const conversation: PartialChatHistory[] = [];

    if (transaction) {
      const request = transaction.objectStore(CHATS_HISTORY_STORE).openCursor();
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            conversation.push({
              id: cursor.value.id,
              title: cursor.value.title,
              updatedAt: cursor.value.updatedAt,
            });
            console.log(`Cursor is : ${JSON.stringify(cursor.value)}`);
            cursor.continue();
          } else {
            console.log(
              `Fetched all conversations ${JSON.stringify(conversation)}`
            );
            resolve(conversation);
          }
        };

        request.onerror = () => {
          console.error(
            `ERROR! Fetching all conversation's partial history failed ${request.error}`
          );
          reject(request.error);
        };
      });
    }

    return Promise.resolve(conversation);
  };

  return (
    <IndexDBContext.Provider
      value={{
        updateChatsHistory,
        getPartialConversationDetails,
        getConversationForId,
      }}
    >
      {children}
    </IndexDBContext.Provider>
  );
};
