import userServiceInstance, { TUserService } from './UserService';
import { IAuth, IShortProfile, IUser } from '../typescript/usersProfileTypeSet';
import { ICurrentChat,  IUseState } from '../typescript/WebsocketServiceTypeSet';
import { IMessage, TShortChat, IShortPrivateChat, isPrivateChat } from '../typescript/ChatingTypeSet';
import { isEmpty } from '@martin_hotell/rex-tils';


class WebSocketService {
    static instance: WebSocketService; 
    callbacks = {};
    socketRef: null | WebSocket;
    userService: TUserService;
    firstConnectIsFailed: boolean;
    setUser: null | Function;
    user: null | IUser;
    auth: null | IAuth;
    setAuth: null | Function;
    chats: {} | IUseState<TShortChat[]>;
    current_chat: {} | ICurrentChat<IMessage[]>;
    profiles: never[] | IUseState<never[] | IShortProfile[]>[];
    endpoint: string;


    static getInstance(): WebSocketService {
        if (!WebSocketService.instance){
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    constructor(){
        this.socketRef = null;
        this.userService = userServiceInstance;
        this.firstConnectIsFailed = false;
        this.setUser = null;
        this.user = null; 
        this.auth = null;
        this.setAuth = null;
        this.chats = {};
        this.current_chat = {};
        this.profiles = [];
        this.endpoint = "ws://localhost:8001/ws/user"
    }

    connect(){
        let token = localStorage.getItem('access');
        if (token === '' || token === null) {
            token = 'token' 
        }
        this.socketRef = new WebSocket(this.endpoint + "?token=" + token);

        this.socketRef.onmessage = e => {
            console.log("onmessage");
            this.socketNewMessage(e.data);
        };

        this.socketRef.onopen = () => {
            console.log("WebSocket open");
        };
        
        this.socketRef.onerror = e => {
            console.log('onerror', e);
        };

        this.socketRef.onclose = e => {
            console.log("WebSocket closed, restarting..");
            console.log(e);
            if (e.code === 4003 ) { // invalidToken
                if (this.firstConnectIsFailed === false) {
                    this.firstConnectIsFailed = true;
                    this.updateAccessToken();
                } else {
                    alert('websocket onclose your session was over, please re sign in ');
                    window.location.href = "http://localhost:3000/";
                }
            } else if (e.code === 4004) { // user not found
                window.location.href = "http://localhost:3000/";
            } else if (e.code === 1006) {
                this.connect();
            }
        };
    }

    async updateAccessToken(){
        const freshToken = localStorage.getItem('refresh'); 
        const dataFreshToken = {
          'refresh': freshToken,
        }
        const userService = userServiceInstance;
        try {
            const response = await userService.getAccessToken(dataFreshToken);
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            userService.updateAccessToken();
            this.connect();
        } catch(error) {
            console.log(error.response)
            if (error.message === 'Network Error') {
                console.log("websocket Network Error");
            } else if (error.response.data.detail === "Token is blacklisted") {
                alert("websocket someone stole your token for authentication, immediately sing in to your account and change your password")
                console.log("there reconnect to login");
            } else if (error.response.data.detail === "Token is invalid or expired") {
                alert("websocket your session was over, please re sign in");
                console.log("there reconnect to login");
            }
        }
    }

    socketNewMessage(data: any){
        const parsedData = JSON.parse(data);
        const type = parsedData.type;
        console.log(data)
        if (type === "profile_status_changes") {
            const profile_id = parsedData.message.profile
            const status = parsedData.message.status
            
            console.log(this.user, 'this.user');
            if (this.setUser) {
                this.setUser({
                    ...this.user,
                    profile: {
                        ...this.user?.profile,
                        status: status
                    }
                })
            }
            if (!isEmpty(this.chats)) {
                const chat_index = this.chats.state.findIndex(
                    chat => isPrivateChat(chat) ? chat.profile.id === Number(profile_id) : false
                );
                if (chat_index !== undefined) {
                    const chats_state = this.chats.state as IShortPrivateChat[];
                    chats_state[chat_index].profile.status = status;
                    this.chats.set([...chats_state]);
                }
            }
            if (!isEmpty(this.profiles)) {
                this.profiles.forEach(profileStateObj => {
                    if (Object.keys(profileStateObj.state).length === 0) {
                        const list: IShortProfile[] = profileStateObj.state;
                        list.forEach((profile, index) => {
                            if (profile.id === Number(profile_id)) {
                                list[index].status = status;
                                profileStateObj.set(list);
                            }
                        });
                    }
                });
            }
        } else if (type === "new_message") {
            console.log("new_message");
            if (!isEmpty(this.current_chat)) {
                console.log(this.current_chat, parsedData.message.chat_message.chat_id);
                if (this.current_chat.chat_id === parsedData.message.chat_message.chat_id) {
                    parsedData.message.chat_message.is_loaded = true;
                    this.current_chat.set([
                        ...this.current_chat.state, 
                        parsedData.message.chat_message
                    ])
                }
            }

            if (!isEmpty(this.chats)) {
                const chat_index = this.chats.state.findIndex(obj => obj.id === Number(parsedData.message.chat_message.chat_id));
                console.log(chat_index, parsedData.message.chat_message);
                if (chat_index !== undefined) {
                    parsedData.message.chat_message.is_loaded = true;
                    const chats_state = this.chats.state;
                    chats_state[chat_index].last_message = parsedData.message.chat_message;
                    this.chats.set([...chats_state]);
                }
            }
        }
    }

    subToProfileStatus(profile_id: number) {
        this.sendWebsocketMessage({command: 'sub_to_profile_status', message: profile_id})
    }
    unsubToProfileStatus(profile_id: number) {
        this.sendWebsocketMessage({command: 'unsub_to_profile_status', message: profile_id})
    }
    subToChat(chat_id: number){
        this.sendWebsocketMessage({command: 'sub_to_chat', message: chat_id});
    }   
    unsubToChat(chat_id: number){
        this.sendWebsocketMessage({command: 'unsub_to_chat', message: chat_id});
    }
    send_message(message: any){
        this.sendWebsocketMessage({command: 'send_message', message: message});
    }

    sendWebsocketMessage(data: any){
        try{
            console.log({...data})
            if (this.socketRef) {
                this.socketRef.send(JSON.stringify({...data}))
            }
        }
        catch(err){
            console.log(err.message);
        }
    }

    waitForSocketConnection(callback: Function, that: any){
        const self = that || this;

        const socket = self.socketRef.readyState;
        const recursion = self.waitForSocketConnection;
        setTimeout(
            function(){
                if(socket === 1) {
                    console.log("Connection is made");
                    callback();
                    return;
                } else {
                    console.log("Wait for connection..");
                    recursion(callback, self);
                }
            }, 100);
    }
    // waitForSocketConnectionHLC() {
    //     let kek = this.waitForSocketConnection();
    //     return kek  
    // }
}


let WebSocketInstance: WebSocketService = WebSocketService.getInstance();

export default WebSocketInstance;