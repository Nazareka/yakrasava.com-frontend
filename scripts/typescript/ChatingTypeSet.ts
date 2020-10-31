import { IShortProfile } from "./usersProfileTypeSet";

interface ITime {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    miliseconds: number,
    utc: string
}
export interface ILastMessage {
    id: number | undefined,
    text: string,
    profile_id: number,
    last_modified: ITime
}

export interface IMessage {
    id: number | undefined,
    text: string,
    profile_id: number,
    last_modified: ITime,
    chat_id: number,
    is_modified: boolean,
    is_revised: boolean,
    is_deleted: boolean,
    is_loaded?: boolean
}

interface IShortAbstractChat {
    id: number,
    chat_type: string,
    last_message: null | ILastMessage
}

interface IFullAbstractChat {
    id: number,
    chat_type: string,
}

interface IShortSavedMessageChat extends IShortAbstractChat {
    name: string,
    image: string,
}
export interface IShortPrivateChat extends IShortAbstractChat {
    profile: IShortProfile
}

interface IFullSavedMessageChat extends IFullAbstractChat {
    name: string,
    image: string,
}
interface IFullPrivateChat extends IFullAbstractChat {
    profile: IShortProfile
}


export type TShortChat = (IShortSavedMessageChat | IShortPrivateChat);
export type TFullChat = (IFullSavedMessageChat | IFullPrivateChat);
export type TChat = (TShortChat | TFullChat);

export const isSavedMessageChat = (chat: TChat): chat is (IShortSavedMessageChat | IFullSavedMessageChat) => {
    if (chat.chat_type === 'saved_messages_chat') {
        return true
    } else {
        return false
    }
}

export const isPrivateChat = (chat: TChat): chat is (IShortPrivateChat | IFullPrivateChat) => {
    if (chat.chat_type === 'private_chat') {
        return true
    } else {
        return false
    }
}