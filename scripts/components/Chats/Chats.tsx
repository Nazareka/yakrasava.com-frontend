import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import userServiceInstance from '../../services/UserService'
import TUseState from '../../typescript/TUseState'
import WebSocketInstance from '../../services/WebSocketService'
import { useHistory } from 'react-router-dom'
import ProfileIdContext from '../../contexts/ProfileIdContext'
import { isSavedMessageChat, isPrivateChat, TShortChat } from '../../typescript/ChatingTypeSet'
import { isEmpty } from '@martin_hotell/rex-tils'

type TChats = TUseState<null | TShortChat[]>

const Chats = (): JSX.Element => {
    let history = useHistory()
    const profile_id: number = useContext(ProfileIdContext)
    const [chats, setChats] = useState(null) as TChats
    const [isWebsocketsConnected, setIsWebsocketsConnected] = useState(false) as TUseState<boolean>
    const chatsRef = useRef(null) as React.MutableRefObject<null | TShortChat[]>
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await userServiceInstance.getAllChats()
                setChats(JSON.parse(response.data))
            } catch(error) {
                console.log(error, 'error')
            }
        }
        fetchData()
        return () => {
            if (!isEmpty(WebSocketInstance.chats)) {
                WebSocketInstance.chats = {}
                if (chatsRef.current) {
                    chatsRef.current.forEach(chat => {
                        WebSocketInstance.waitForSocketConnection(() => {
                            WebSocketInstance.unsubToChat(chat.id)
                        }, null)
                        if (isPrivateChat(chat)) {
                            WebSocketInstance.waitForSocketConnection(() => {
                                WebSocketInstance.unsubToProfileStatus(chat.profile.id)
                            }, null)
                        }
                    })
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
		if (chats && !isWebsocketsConnected) {
            chatsRef.current = chats
            setIsWebsocketsConnected(true)
            WebSocketInstance.chats = {
                state: chats,
                set: setChats 
            }
            chats.forEach(chat => {
                WebSocketInstance.waitForSocketConnection(() => {
                    WebSocketInstance.subToChat(chat.id)
                }, null)
                if (isPrivateChat(chat)) {
                    WebSocketInstance.waitForSocketConnection(() => {
                        WebSocketInstance.subToProfileStatus(chat.profile.id)
                    }, null)
                }
            })
		}
    }, [chatsRef, chats, setChats, setIsWebsocketsConnected, isWebsocketsConnected])

    const OpenChatHandle = (chat_id: number) => {
        history.push("/chat/id=" + chat_id)
    }
    
    if (!chats) {
        return <div> loading </div>
    }
    
    return (  
        <div>
            {/* in feature */}
            {/* <div>
                <form className="search-container">
                    <input  type="text" 
                            className="search-bar" 
                            placeholder="Знайди переписку" />
                    <span>
                        <img className="search-icon" src="http://www.endlessicons.com/wp-content/uploads/2012/12/search-icon.png" alt="search" />
                    </span>
                </form>
            </div> */}
            <div className="chats-container">
                { chats.map((chat) => 
                    <div className="chat" onClick={() => OpenChatHandle(chat.id)}>
                        <div className='logo'>
                            <img src={
                                "http://127.0.0.1:8001/static" + (
                                isSavedMessageChat(chat)
                                ?
                                '/assets/imageProfile_Z4FecWx.png'
                                :
                                isPrivateChat(chat)
                                ?
                                chat.profile.image
                                :
                                null
                                )
                            }
                                alt='chat-logo' />
                        </div>
                        <div className="body-container">
                            <div className="title">
                                {isSavedMessageChat(chat)
                                ?
                                chat.name
                                :
                                isPrivateChat(chat)
                                ?
                                chat.profile.nickname + " " + chat.profile.status
                                :
                                null
                                }
                            </div>
                            <div className="last-message">
                                {
                                    chat.last_message === null
                                    ?
                                    <span>
                                        chat was created
                                    </span>
                                    :
                                    <Fragment>
                                        <span>
                                            {profile_id === chat.last_message.profile_id
                                            ? 
                                            "you: "
                                            :
                                            ""}
                                        </span>
                                        <span>
                                            {chat.last_message.text + " "}
                                        </span>
                                        <span>
                                            {chat.last_message.last_modified.hour + ":" + chat.last_message.last_modified.minute}
                                        </span>
                                    </Fragment>
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
 
export default Chats