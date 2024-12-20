import { Message } from "ai/react"

export enum Author {
  Assistant = "assistant", 
  User = "user"
}

export type IChatMessage = Message; 

export interface IChatHistory {
    id: string, 
    title: string,
    createdAt: number,
    updatedAt?: number, 
    conversation: IChatMessage[]
}

export type PartialChatHistory = Pick<IChatHistory, 'id' | 'title' | 'updatedAt'>