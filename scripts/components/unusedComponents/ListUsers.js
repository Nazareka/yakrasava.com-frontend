import React, { useEffect, useState, useContext, Fragment } from 'react';
import UserService from '../../UserService';
import AppContext from '../contexts/AppContext';
import WebSocketInstance from '../../WebSocketService';


const ListUsers = () => {
	const context = useContext(AppContext);
    const [listUsers, setListUsers] = useState(null);
    const [usersRS, setUsersRS] = useState(null);
    const [usersStatus, setUsersStatus] = useState(null)
    useEffect(() => {
        const userService = new UserService();

        // WebSocketInstance.connect();
        console.log('kek');
        // WebSocketInstance.initUser();

        userService.getListFriends().then(
            response => {
                console.log(response.data);
                setListUsers(response.data);
            },
            error => {
                console.log(error, 'error');
            }
        )
        // userService.getListFriends().then(
        //     response => {
        //         console.log(response.data);
        //         setUsersRS(response.data);
        //     }
        // )
    }, [])
    useEffect(() => {
        if (listUsers !== null) {
            let listUsersStatus = {};
            listUsers.forEach(user => {
                listUsersStatus[user.id] = user.status
            });
            setUsersStatus(listUsersStatus);
            // WebSocketInstance.waitForSocketConnection(() => {
            //     listUsers.forEach(user => {
            //         WebSocketInstance.watchingForStatus(user.id);
            //     });
            // })
            // listUsers.forEach(user => {
            //     WebSocketInstance.watchingForStatus(user.id);
            // });
        }
    }, [listUsers]);
    useEffect(() => {
        console.log('testefectusersStatus')
        if (usersStatus !== null) {
            console.log('testefect', usersStatus, setUsersStatus)
            // WebSocketInstance.setUsersStatus = setUsersStatus
            // WebSocketInstance.usersStatus = usersStatus
        }
    }, [usersStatus]);
    const handlerChangeRelationship = (friend_user_id, action) => {
        const data = {
            "friend_user_id": friend_user_id,
            "action": action
        }
        WebSocketInstance.changeRelationship(data);
        let kek = usersStatus;
        kek[17] = "onlain";
        setUsersStatus({
            ...usersStatus,
            kek
        });
        // const userService = new UserService();
        // const data = {
        //     "friend_user_id": friend_user_id,
        //     "action": action
        // }
        // userService.changeRelationship(data).then(
        //     response => {
        //         // alert("user was ssuccesfuly added to your friends!!!");
        //         console.log(response);
        //         const userService = new UserService();
        //         userService.getListFriends().then(
        //             response => {
        //                 console.log(response.data);
        //                 setUsersRS(response.data);
        //             }
        //         )
        //     },
        //     error => {
        //         console.log(error, 'error');
        //     }
        // );
    }

    if (!listUsers) {
        return <div> loading </div>
    }
    console.log('rerendering', usersStatus)
    return (  
        <div>
            <table className="listUsers" >
                <thead>
                    <tr>
                        <th>user id</th>
                        <th>user name</th>
                        <th>sex</th>
                        <th>location</th>
                        <th>status</th>
                        <th>follow</th>
                        <th>make close friend</th>
                        <th>make relative</th>
                        <th>make beloved</th>
                        <th>status network</th>
                    </tr>
                </thead>
                <tbody>
                    { listUsers.map( (user, i) => 
                        <tr key={user.id}>
                            <th>{user.id}</th>
                            <th>{user.nickname}</th>
                            <th>{user.sex}</th>
                            <th>{user.location}</th>
                            { context.cur_profile_id !== user.id ?
                                <Fragment>
                                    { usersRS[user.id] !== undefined ?
                                        usersRS[user.id].related === "from" ? 
                                            <Fragment>
                                            <th>
                                                <div>
                                                    { usersRS[user.id].status }
                                                </div>
                                            </th>
                                            { usersRS[user.id].status === 'follow' ?
                                                <Fragment>
                                                <th>
                                                    <div>
                                                        <button onClick={() => handlerChangeRelationship(user.id, 'unfollow')} >
                                                            unfollow
                                                        </button>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div>
                                                        you cant do this
                                                    </div>
                                                </th>
                                                <th>
                                                    <div>
                                                        you cant do this
                                                    </div>
                                                </th>
                                                <th>
                                                    <div>
                                                        you cant do this
                                                    </div>
                                                </th>
                                                <th className={usersStatus[user.id] === "online" ? "online" : "offline"} >
                                                    { usersStatus[user.id] }
                                                </th>    
                                                </Fragment>
                                            :   <Fragment>
                                                { usersRS[user.id].status === 'friend' ?
                                                    <th>
                                                        <button onClick={() => handlerChangeRelationship(user.id, 'unfriend')} >
                                                            unfriend
                                                        </button>
                                                    </th>
                                                :   <th>
                                                        <div>
                                                            you cant do this
                                                        </div>
                                                    </th> }
                                                { usersRS[user.id].status !== 'close_friend' ?
                                                    <th>
                                                        <button onClick={() => handlerChangeRelationship(user.id, 'make_close_friend')} >
                                                            make close friend
                                                        </button>
                                                    </th>
                                                :   <th>
                                                        <button onClick={() => handlerChangeRelationship(user.id, 'unmake_close_friend')} >
                                                            unmake close friend
                                                        </button>
                                                    </th> }
                                                { usersRS[user.id].status !== 'relative' ?
                                                    <th>
                                                        <button onClick={() => handlerChangeRelationship(user.id, 'make_relative')} >
                                                            make relative
                                                        </button>
                                                    </th>
                                                :   <th>
                                                        <button onClick={() => handlerChangeRelationship(user.id, 'unmake_relative')} >
                                                            unmake relative
                                                        </button>
                                                    </th> }
                                                { usersRS[user.id].status !== 'beloved' ?
                                                    <th>
                                                        <button onClick={() => handlerChangeRelationship(user.id, 'make_beloved')} >
                                                            make beloved
                                                        </button>
                                                    </th>
                                                :   <th>
                                                        <button onClick={() => handlerChangeRelationship(user.id, 'unmake_beloved')} >
                                                            unmake beloved
                                                        </button>
                                                    </th> }
                                                <th className={usersStatus[user.id] === "online" ? "online" : "offline"} >
                                                    { usersStatus[user.id] }
                                                </th>
                                                </Fragment>
                                            }
                                            </Fragment>
                                        : usersRS[user.id].related === "to" ? 
                                            <Fragment>
                                                <th>
                                                    <div>
                                                        is following you
                                                    </div> 
                                                </th>
                                                <th>
                                                    <button onClick={() => handlerChangeRelationship(user.id, 'make_friend')} >
                                                        make friend
                                                    </button>
                                                </th>
                                                <th>
                                                    <div>
                                                        you cant do this
                                                    </div>
                                                </th>
                                                <th>
                                                    <div>
                                                        you cant do this
                                                    </div>
                                                </th>
                                                <th>
                                                    <div>
                                                        you cant do this
                                                    </div>
                                                </th>
                                                <th className={usersStatus[user.id] === "online" ? "online" : "offline"} >
                                                    { usersStatus[user.id] }
                                                </th>
                                            </Fragment>
                                        : null 
                                    :   <Fragment>
                                        <th>
                                            <div>
                                                has no RS
                                            </div>
                                        </th>
                                        <th>
                                            <button onClick={() => handlerChangeRelationship(user.id, 'follow')} >
                                                follow
                                            </button>
                                        </th>
                                        <th>
                                            <div>
                                                you cant do this
                                            </div>
                                        </th>
                                        <th>
                                            <div>
                                                you cant do this
                                            </div>
                                        </th>
                                        <th>
                                            <div>
                                                you cant do this
                                            </div>
                                        </th>
                                        <th className={usersStatus[user.id] === "online" ? "online" : "offline"} >
                                            { usersStatus[user.id] }
                                        </th>
                                        </Fragment>
                                    }
                                {/* <th>
                                    <button onClick={() => handlerChangeRelationship(user.id)} >
                                        make beloved
                                    </button>
                                </th> */}
                                </Fragment>
                            :   <Fragment>
                                <th><div>is you</div></th>
                                <th><div>is you</div></th>
                                <th><div>is you</div></th> 
                                <th><div>is you</div></th>
                                <th><div>is you</div></th>
                                <th className={usersStatus[user.id] === "online" ? "online" : "offline"} >
                                    { usersStatus[user.id] }
                                </th>
                                </Fragment>
                            }
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
 
export default ListUsers;