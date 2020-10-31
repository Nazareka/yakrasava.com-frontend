import React, { useState, useEffect, useRef } from 'react';
import userServiceInstance from '../../services/UserService';
import SearchFriendsBar from './SearchFriendsBar';
import ReloadSearchFriendsResultsContext from '../../contexts/ReloadSearchFriendsResultsContext';
import { useHistory } from "react-router-dom";
import TUseState from '../../typescript/TUseState';
import { IShortProfile } from '../../typescript/usersProfileTypeSet';
import WebSocketInstance from '../../services/WebSocketService';
import { isEmpty } from '@martin_hotell/rex-tils';

type TListUsers = TUseState<never[] | IShortProfile[]>;

const Friends = (): JSX.Element => {

    const friendsRow = useRef(null);
    const [listFriends, setListFriends] = useState([]) as TListUsers;
    const [listFollowers, setListFollowers] = useState([]) as TListUsers;
    const [listFollows, setListFollows] = useState([]) as TListUsers;
    const [listFoundUsers, setListFoundUsers] = useState([]) as TListUsers;
    const [isDataLoaded, setIsDataLoaded] = useState(false) as TUseState<boolean>; 

    const [isWebsocketsConnected, setIsWebsocketsConnected] = useState(false) as TUseState<boolean>;
    const listsUsersRef = useRef(null) as React.MutableRefObject<null | (never[] | IShortProfile[])[]>;

    let history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseListFriends = await userServiceInstance.getListFriendsByCurrentUser();
                const responseListFollowers = await userServiceInstance.getListFollowersByCurrentUser();
                const responseListFollows = await userServiceInstance.getListFollowsByCurrentUser();
                
                setListFriends(JSON.parse(responseListFriends.data));
                setListFollowers(JSON.parse(responseListFollowers.data));
                setListFollows(JSON.parse(responseListFollows.data));
    
            } catch(error) {
                console.log(error, 'error');
            } finally {
                setIsDataLoaded(true);
            }
        }
        fetchData();
        return () => {
            if (!isEmpty(WebSocketInstance.profiles)) {
                WebSocketInstance.profiles = [];
                if (listsUsersRef.current) {
                    listsUsersRef.current.forEach(list => {
                        if (!isEmpty(list)) {
                            list.forEach(profile => {
                                WebSocketInstance.waitForSocketConnection(() => {
                                    WebSocketInstance.unsubToProfileStatus(profile.id);
                                }, null);
                            });
                        }
                    });
                }
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
		if (isDataLoaded && !isWebsocketsConnected) {
            // chatsRef.current = chats;
            setIsWebsocketsConnected(true);
            WebSocketInstance.profiles = [
                {
                    state: listFriends,
                    set: setListFriends 
                },
                {
                    state: listFollowers,
                    set: setListFollowers 
                },
                {
                    state: listFollowers,
                    set: setListFollows 
                }
            ];
            listsUsersRef.current = [
                listFriends, listFollowers, listFollowers
            ]
            WebSocketInstance.profiles.forEach(listProfiles => {
                if (!isEmpty(listProfiles.state)) {
                    listProfiles.state.forEach(profile => {
                        WebSocketInstance.waitForSocketConnection(() => {
                            WebSocketInstance.subToProfileStatus(profile.id);
                        }, null);
                    });
                }
            });
		}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDataLoaded, isWebsocketsConnected])

    const handleClickOpenProfile = (profile_id: number) => {
        history.push("/profile_id=" + profile_id);
    }

    if (!isDataLoaded) {
        return <div> loading </div>
    }

    return (
        <div className="friends">
            <ReloadSearchFriendsResultsContext.Provider value={{'setListFoundUsers': setListFoundUsers}}>
                <SearchFriendsBar />
            </ReloadSearchFriendsResultsContext.Provider>
            <div className="row-container">
                <div className="row">
                {!isEmpty(listFoundUsers) ? 
                    listFoundUsers.map( (profile) =>
                        <div>
                            <div className="img-profile-container">
                                <img src={"http://127.0.0.1:8001/static" + profile.image } 
                                    className="profile"
                                    width="100px"
                                    height="135px"
                                    alt="friend" 
                                    onClick={(e) => handleClickOpenProfile(profile.id)}
                                />
                            </div>
                            <div className="img-profile-container">
                                { profile.nickname }
                            </div>
                            <div className="img-profile-container">
                                { profile.status }
                            </div>
                        </div>
                    )
                : "no one found" }
                </div>
            </div>
            <div className="title">
                Your friends
            </div>
            <div className="row-container">
                <div className="row" ref={friendsRow}>
                {!isEmpty(listFriends) ? 
                    listFriends.map( (profile) =>
                        <div>
                            <div className="img-profile-container">
                                    <img src={"http://127.0.0.1:8001/static" + profile.image } 
                                        className="profile"
                                        width="100px"
                                        height="135px"
                                        alt="friend"
                                        onClick={(e) => handleClickOpenProfile(profile.id)}
                                    />
                            </div>
                            <div className="img-profile-container">
                                { profile.nickname }
                            </div>
                            <div className="img-profile-container">
                                { profile.status }
                            </div>
                        </div>
                    )
                : null }
                </div>
            </div>
            <div className="title">
                Your followers
            </div>
            <div className="row-container">
                <div className="row" ref={friendsRow}>
                {!isEmpty(listFollowers) ? 
                    listFollowers.map( (profile) =>
                        <div>
                            <div className="img-profile-container">
                                <img src={"http://127.0.0.1:8001/static" + profile.image } 
                                    className="profile"
                                    width="100px"
                                    height="135px"
                                    alt="friend"
                                    onClick={(e) => handleClickOpenProfile(profile.id)} 
                                />
                            </div>
                            <div className="img-profile-container">
                                { profile.nickname }
                            </div>
                            <div className="img-profile-container">
                                { profile.status }
                            </div>
                        </div>
                    )
                : null }
                </div>
            </div>
            <div className="title">
                Your follows
            </div>
            <div className="row-container">
                <div className="row" ref={friendsRow}>
                {!isEmpty(listFollows) ? 
                    listFollows.map( (profile) =>
                        <div>
                            <div className="img-profile-container">
                                <img src={"http://127.0.0.1:8001/static" + profile.image } 
                                    className="profile"
                                    width="100px"
                                    height="135px"
                                    alt="friend"
                                    onClick={(e) => handleClickOpenProfile(profile.id)} 
                                />
                            </div>
                            <div className="img-profile-container">
                                { profile.nickname }
                            </div>
                            <div className="img-profile-container">
                                { profile.status }
                            </div>
                        </div>
                    )
                : null }
                </div>
            </div>
        </div>
    );
}
 
export default Friends;