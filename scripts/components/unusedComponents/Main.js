//import React, { useState, useEffect } from 'react';
// import MyProfile from '../MyProfile';
// import News from './News';
// import MyNews from './MyNews';
// import ListUsers from './ListUsers';
// import UserService from '../../../UserService';
// import Friends from '../Friends';


// const Main = ({ currentBlock }) => {
//     // const [user, setUser] = useState(null);
//     // useEffect(() => {
//     //     const userService = new UserService();
//     //     userService.getUserAndProfile().then(
//     //         response => {
//     //             console.log(response.data);
//     //             setUser(response.data);
//     //         },
//     //         error => {
//     //             console.log(error);
//     //         }
//     //     )
//     // }, [])
//     // if (user === null) {
//     //     return <div> loading </div>
//     // }

//     let currentBlockPage = null;
//     if (currentBlock === 'my_profile') {
// 		currentBlockPage = <MyProfile />
// 	} else if (currentBlock === 'news') {
// 		currentBlockPage = <News />
// 	} else if (currentBlock === 'my_news') {
// 		currentBlockPage = <MyNews />		
// 	} else if (currentBlock === 'list_users') {
// 		currentBlockPage = <ListUsers idOfCurrentUser={12} />	    	
// 	} else if (currentBlock === 'friends') {
// 		currentBlockPage = <Friends />	    	
// 	}
//     return (   
//         <main className="main">
//             { currentBlockPage }
//         </main>
//     );
// }
 
// export default Main;