import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router";
import './sass/style.sass';
import Login from "./scripts/components/Login/Login";
import userServiceInstance from "./scripts/services/UserService";
import Registration from './scripts/components/Registration/Registration';
import Header from "./scripts/components/Header/Header";
import CreateProfile from "./scripts/components/CreateProfile/CreateProfile";
import Profile from './scripts/components/Profile/Profile';
import MyProfile from './scripts/components/MyProfile/MyProfile';
import Chats from './scripts/components/Chats/Chats';
import Chat from './scripts/components/Chat/Chat';
import UnAuthContainer from "./scripts/containers/UnAuthContainer";
import AuthContainer from "./scripts/containers/AuthContainer/AuthContainer";
import WebSocketInstance from './scripts/services/WebSocketService';
import TUseState from './scripts/typescript/TUseState';
import ProfileIdContext from './scripts/contexts/ProfileIdContext';
import { IAuth } from "./scripts/typescript/usersProfileTypeSet";
import Friends from "./scripts/components/Friends/Friends";

const App = (): JSX.Element => {

	const [auth, setAuth] = useState({
		isAuthOver: false,
		isLoggedIn: false,
		profile_id: null,
		networkError: false,
		isWebSocketConnected: false
	}) as TUseState<IAuth>;

	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			try {
				const response = await userServiceInstance.getProfileIdCurrentUser();
				console.log(response);
				setAuth({
					...auth,
					isAuthOver: true,
					isLoggedIn: true,
					profile_id: response.data.user.profile_id,
				});
			} catch {
				const freshToken = localStorage.getItem('refresh'); 
		      	const dataFreshToken = {
		        	'refresh': freshToken,
				}
				try {
					const response = await userServiceInstance.getAccessToken(dataFreshToken);
					localStorage.setItem('access', response.data.access);
					localStorage.setItem('refresh', response.data.refresh);
					userServiceInstance.updateAccessToken();
					try { // success on again access
						const response = await userServiceInstance.getProfileIdCurrentUser();
						console.log(response, 'again');
						setAuth({
							...auth,
							isAuthOver: true,
							isLoggedIn: true,
							profile_id: response.data.user.profile_id
						});
					} catch { // unexpected error
						setAuth({
							...auth,
							isAuthOver: true,
							isLoggedIn: false,
						});
					}
				} catch(error) {
					console.log(error)
					if (error.message === 'Network Error') {
						setAuth({
							...auth,
							networkError: true,
						});
					} else if (error.response.data.detail === "Token is blacklisted") {
						alert("someone stole your token for authentication, immediately sing in to your account and change your password")
						setAuth({
							...auth,
							isAuthOver: true,
							isLoggedIn: false,
						});
					} else if (error.response.data.detail === "Token is invalid or expired") {
						alert("your session was over, please re sign in");
						setAuth({
							...auth,
							isAuthOver: true,
							isLoggedIn: false,
						});
					} else if (error.response.data.refresh[0] === "This field may not be null.") {
						setAuth({
							...auth,
							isAuthOver: true,
							isLoggedIn: false,
						});
					}
				}
			}
		}
		fetchData();
		// userServiceInstance.getProfileIdCurrentUser().then( 
		// 	(response: any) => { // success on access
		// 		console.log(response);
	  	// 		setAuth({
		// 			...auth,
		// 			isAuthOver: true,
		// 			isLoggedIn: true,
		// 			profile_id: response.data.user.profile_id,
		// 		});
		// 	}, 
		// 	(error: any) => { // fail on access
		// 		const freshToken = localStorage.getItem('refresh'); 
		//       	const dataFreshToken = {
		//         	'refresh': freshToken,
		//       	}
		//       	userServiceInstance.getAccessToken(dataFreshToken).then(
		//       		(response: any) => { // success on obtain access token
		// 				localStorage.setItem('access', response.data.access);
		// 				localStorage.setItem('refresh', response.data.refresh);
		// 	        	const newUserService = new UserService();
		// 	      		newUserService.getProfileIdCurrentUser().then(
		// 	      			(response: any) => { // success on again access
		// 						console.log(response, 'again');
		// 			        	setAuth({
		// 							...auth,
		// 							isAuthOver: true,
		// 							isLoggedIn: true,
		// 							profile_id: response.data.user.profile_id
		// 						});
		// 					},
		// 					(error: any) => { // unexpected error 
		// 			        	setAuth({
		// 							...auth,
		// 							isAuthOver: true,
		// 							isLoggedIn: false,
		// 						});
		// 			        });
		// 		    }, 
		// 			(error: any) => { // fail on obtain access token
		// 				console.log(error)
		// 				if (error.message === 'Network Error') {
		// 					setAuth({
		// 						...auth,
		// 						networkError: true,
		// 					});
		// 				} else if (error.response.data.detail === "Token is blacklisted") {
		// 					alert("someone stole your token for authentication, immediately sing in to your account and change your password")
		// 					setAuth({
		// 						...auth,
		// 						isAuthOver: true,
		// 						isLoggedIn: false,
		// 					});
		// 				} else if (error.response.data.detail === "Token is invalid or expired") {
		// 					alert("your session was over, please re sign in");
		// 					setAuth({
		// 						...auth,
		// 						isAuthOver: true,
		// 						isLoggedIn: false,
		// 					});
		// 				} else if (error.response.data.refresh[0] === "This field may not be null.") {
		// 					setAuth({
		// 						...auth,
		// 						isAuthOver: true,
		// 						isLoggedIn: false,
		// 					});
		// 				}
		// 		    }
		// 		); 
		// 	}
		// );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	useEffect(() => {
		if (!auth.isWebSocketConnected && auth.isLoggedIn) {
			auth.isWebSocketConnected = true
			WebSocketInstance.auth = auth
			WebSocketInstance.setAuth = setAuth
			WebSocketInstance.connect();
		}
	}, [auth, setAuth])
	if (auth.networkError) {
		return (
			<div>
				network error
			</div>
		);
	}
	if (!auth.isAuthOver) {
		if (!auth.isLoggedIn) {
			return (
				<div>
					loading
				</div>
			);
		} else {
			if (!auth.isWebSocketConnected) {
				return (
					<div>
						loading
					</div>
				);
			}
		}
	}
	return (
		<Route path="/">
			<Switch>
				<Route exact path="/login">
					<Login />
				</Route>
				<Route exact path="/registration" >
					<Registration />
				</Route>
				<Route exact path="/create_profile">
					<CreateProfile />
				</Route>
				{(auth.isLoggedIn && !auth.profile_id) ? <Redirect to="/create_profile" /> : null }
				<Route path="/">
					<Header loggedIn={auth.isLoggedIn} />

					{ auth.isLoggedIn ? 
					<ProfileIdContext.Provider value={auth.profile_id} >
						<Switch>
							<Route exact path="/profile_id=:profile_id" >
								<AuthContainer currentBlock={null}>
									<Profile />
								</AuthContainer>
							</Route>
							<Route exact path="/my_profile">
								<AuthContainer currentBlock={'my_profile'}>
									<MyProfile />
								</AuthContainer>
							</Route>
							<Route exact path="/chats">
								<AuthContainer currentBlock={'chats'}>
									<Chats />
								</AuthContainer>
							</Route>
							<Route exact path="/chat/id=:chat_id">
								<AuthContainer currentBlock={null}>
									<Chat />
								</AuthContainer>
							</Route>
							<Route exact path="/friends">
								<AuthContainer currentBlock={'friends'}>
									<Friends />
								</AuthContainer>
							</Route>
							<Route path="/">
								<Redirect exact from="/" to="/my_profile" />
							</Route>
						</Switch>
					</ProfileIdContext.Provider>
					:
					<Switch>
						<Route exact path="/profile_id=:profile_id" >
							<UnAuthContainer>
								<Profile />
							</UnAuthContainer>
						</Route>
						<Route exact path="/my_profile">
							<Redirect to="/login" />
						</Route>
						<Route exact path="/my_news">
							<Redirect to="/login" />
						</Route>
						<Route exact path="/news">
							<Redirect to="/login" />
						</Route>
						<Route exact path="/list_users">
							<Redirect to="/login" />
						</Route>
						<Route exact path="/friends">
							<Redirect to="/login" />
						</Route>
						<Route path="/">
							<Redirect to="/login" />
						</Route>
					</Switch>
					}
				</Route>
			</Switch>
		</Route>
	);
};

export default App;