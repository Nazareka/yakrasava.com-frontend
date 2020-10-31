// import { IMessage, TShortChat } from "./ChatingTypeSet";

// export interface ICurrentChat {
//     chat_id: number,
//     messages_state: IMessage[],
//     set_message: Function 
// }
// export interface IShortChat {
//     chats_state: TShortChat[],
//     set_chats: Function
// }

export interface IUseState<T> {
    state: T,
    set: Function
}
export interface ICurrentChat<T> extends IUseState<T> {
    chat_id: number,
}
