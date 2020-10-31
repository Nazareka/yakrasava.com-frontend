/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect, useRef } from 'react'
import ProfileIdContext from '../../contexts/ProfileIdContext'
import { useParams } from "react-router-dom"
import TUseState from '../../typescript/TUseState'
import userServiceInstance from '../../services/UserService'
import WebSocketInstance from '../../services/WebSocketService'
import { isPrivateChat, isSavedMessageChat, TFullChat } from '../../typescript/ChatingTypeSet'
import { isEmpty } from '@martin_hotell/rex-tils'

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
interface IMessage {
    id: number | undefined,
    chat_id: number,
    profile_id: number,
    text: string,
    last_modified: ITime,
    is_modified: boolean,
    is_revised: boolean,
    is_deleted: boolean,
    is_loaded?: boolean
}
interface IChatID {
	chat_id: string
}


type TInputMessage = React.RefObject<HTMLInputElement>

type TChat = TUseState<undefined | TFullChat>
type TMessages = TUseState<undefined | IMessage[]>
type TInputValue = TUseState<string>
type TIsWebsocketsConnected = TUseState<boolean>
 
const Chat = (): JSX.Element => {

    const profile_id: number = useContext(ProfileIdContext)

    let { chat_id } = useParams() as IChatID

    const inputMessage = useRef() as TInputMessage

    const [chat, setChat] = useState() as TChat
    const [messages, setMessages] = useState() as TMessages
    const [inputValue, setInputValue] = useState('') as TInputValue
    const [isWebsocketsConnected, setIsWebsocketsConnected] = useState(false) as TIsWebsocketsConnected
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseChat = await userServiceInstance.getChatById(chat_id)
    
                setChat(JSON.parse(responseChat.data))
    
            } catch(error) {
                console.log(error, 'error')
            }
        }
        fetchData()
    }, [setChat])
    
    useEffect(() => {
        if (chat) {
            const fetchData = async () => {
                try {
                    const responseMessages = await userServiceInstance.getMessagesByChatId(chat_id)
                    const messages = JSON.parse(responseMessages.data)
                    messages.forEach((element: IMessage) => {
                        element.is_loaded = true
                    })
                    setMessages(messages)
                } catch(error) {
                    console.log(error, 'error')
                }
            }
            fetchData()
        }
    }, [chat])

    useEffect(() => {
		if (chat && messages && !isWebsocketsConnected) {

            WebSocketInstance.current_chat = {
                chat_id: Number(chat_id),
                state: messages,
                set: setMessages 
            }

            WebSocketInstance.waitForSocketConnection(() => {
                WebSocketInstance.subToChat(Number(chat_id))
            }, null)
            setIsWebsocketsConnected(true)

		}
    }, [chat, messages, isWebsocketsConnected])

    useEffect(() => {
        return () => {
            if (!isEmpty(WebSocketInstance.current_chat)) {
                console.log('WebSocketInstance.current_chat = {}')
                WebSocketInstance.current_chat = {}
                WebSocketInstance.waitForSocketConnection(() => {
                    WebSocketInstance.unsubToChat(Number(chat_id))
                }, null)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        if (messages && isWebsocketsConnected) {
            let hasUnsentMessages = false
            messages.forEach(message => message.id === undefined ? hasUnsentMessages = true : null)
            if (!hasUnsentMessages) {
                console.log(WebSocketInstance.current_chat, 'WebSocketInstance.chats')
                if (!isEmpty(WebSocketInstance.current_chat)) {
                    WebSocketInstance.current_chat = {
                        ...WebSocketInstance.current_chat,
                        state: messages
                    }
                }
            }
            console.log('messages && !isWebsocketsConnected')
        }
    }, [messages, isWebsocketsConnected])

    if (!chat || !messages) {
        return <div> loading </div>
    }

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (inputValue !== '') {
            // const target = e.target as HTMLFormElement
            const nowDate = new Date()
            console.log(Date())
            const new_message = {
                id: undefined,
                chat_id: Number(chat_id),
                profile_id: profile_id,
                text: inputValue,
                last_modified: {
                    year: nowDate.getFullYear(),
                    month: nowDate.getMonth(),
                    day: nowDate.getDate(),
                    hour: nowDate.getHours(),
                    minute: nowDate.getMinutes(),
                    second: nowDate.getSeconds(),
                    miliseconds: nowDate.getMilliseconds(),
                    utc: 'nowDate.getMilliseconds()'
                },
                is_modified: false,
                is_revised: false,
                is_deleted: false,
                is_loaded: false,
            }
            setMessages([...messages, new_message])
            if (inputMessage && inputMessage.current) { 
                inputMessage.current.value = '' 
                setInputValue('')
            }
            WebSocketInstance.waitForSocketConnection(() => {
				WebSocketInstance.send_message(
                    {
                        text: inputValue, 
                        chat_id: chat_id
                    }
                )
			}, null)

        }
    } 

    return (  
        <div className="chat">
            <div className="chat-header">
                <div className='chat-logo'>
                    <img src={
                            "http://127.0.0.1:8001/static" + (
                            isSavedMessageChat(chat)
                            ?  '/assets/imageProfile_Z4FecWx.png'
                            :  isPrivateChat(chat)
                            ?  chat.profile.image
                            :  null
                            )
                        } alt='chat-logo' className="chat-logo"/>
                </div>
                <div className="title-and-status-container">
                    <div className="title">
                        {isSavedMessageChat(chat)
                        ?
                        chat.name
                        :
                        isPrivateChat(chat)
                        ?
                        chat.profile.nickname
                        :
                        null
                        }
                    </div>
                    <div className="status">
                        {isSavedMessageChat(chat)
                        ?
                        ""
                        :
                        isPrivateChat(chat)
                        ?
                        chat.profile.status
                        :
                        null
                        }
                    </div>
                </div>  
            </div>
            <div className="body">
                <div className="messages">
                    <div className="message-info-container">
                        <div className="message-info" >
                            <div>
                                чат був створений
                            </div>
                        </div>
                    </div>
                    { messages.map((message) => 
                        <div className={ 
                            message.profile_id === profile_id 
                            ? 
                            "message-cur-user-container"
                            : 
                            "message-an-user-container"}
                        >
                            <div className={ 
                                message.profile_id === profile_id 
                                ? 
                                "message-cur-user"
                                : 
                                "message-an-user"}
                            >
                                <div className="message-text">
                                    { message.text }
                                </div>
                                <div className="message-item">
                                    { message.last_modified.hour + ':' + message.last_modified.minute }
                                </div>
                                {/* <div className="message-item">
                                    { message.is_revised ? ' -- ' : ' - '}
                                </div> */}
                                <div className="message-item">
                                    { message.is_loaded ? ' || ' : '| '}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* <div className="message-cur-user-container">
                        <div className="message-cur-user" >
                            <div>
                                message-cur-user
                            </div>
                            <div>
                                23:00
                            </div>
                            <div>
                                -
                            </div>
                        </div>
                    </div>
                    <div className="message-an-user-container">
                        <div className="message-an-user" >
                            <div>
                                message-an-user
                            </div>
                            <div>
                                23:00
                            </div>
                            <div>
                                -
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className="footer" >
                <form className="send-message-container" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSendMessage(e)}>
                    <input  type="text" 
                            className="send-message-bar" 
                            placeholder="something print..."
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                            ref={inputMessage}
                            // onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleSendMessage(e)}
                    />
                    {/* <span>
                        <img className="send-message-icon" src="http://endlessicons.com/wp-content/uploads/2013/06/paper-plane-icon-614x460.png" alt="send-message" />
                    </span> */}
                </form>               
            </div>
        </div>
    )
}

export default Chat