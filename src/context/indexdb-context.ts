import { IChatHistory, PartialChatHistory } from '@/types';
import * as React from 'react'; 

export interface IIndexDBContextValues {
  updateChatsHistory: (chatHistory: IChatHistory | undefined) => void;
  getConversationForId: (id?: string) => Promise<IChatHistory | undefined>; 
  getPartialConversationDetails: () => Promise<PartialChatHistory[]>;
}

export const IndexDBContext = React.createContext<IIndexDBContextValues>({
  updateChatsHistory: () => undefined,
  getConversationForId: () => Promise.reject(''),
  getPartialConversationDetails: () => Promise.reject('')
}); 


export const useIndexDbContext = () => React.useContext(IndexDBContext);