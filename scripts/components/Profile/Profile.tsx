import React, { useState, useEffect } from 'react';
import userServiceInstance from '../../services/UserService';
import { useHistory, useParams } from "react-router-dom";
import FriendDropdown from '../Friends/FriendDropdown';
import ReloadProfileContext from '../../contexts/ReloadProfileContext';
import WebSocketInstance from '../../services/WebSocketService';
import TUseState from '../../typescript/TUseState';
import { IUser } from '../../typescript/usersProfileTypeSet';


interface IParamsProfileID {
	profile_id: string
}


const Profile = (): JSX.Element => {

	let { profile_id }: IParamsProfileID = useParams();

	let history = useHistory();
	
	const [user, setUser] = useState() as TUseState<undefined | IUser>;

	const [lastUpdated, setLastUpdated] = useState() as TUseState<undefined | Date>;

    useEffect(() => {
		const fetchData = async () => {
            try {
				const responseProfile = await userServiceInstance.getFullProfileByProfileId_authed(profile_id);
				setUser(JSON.parse(responseProfile.data));
            } catch(error) {
                console.log(error, 'error');
            }
        }
        fetchData();
	}, [profile_id, setUser])

	useEffect(() => {
		if (user && !lastUpdated) {
			// WebSocketInstance.waitForSocketConnection(() => {
			// 	WebSocketInstance.watching_for_another_profile_status(profile_id);
			// }, null);
			WebSocketInstance.setUser = setUser;
			WebSocketInstance.user = user;

		}
	}, [user, lastUpdated, setUser])
	
	useEffect(() => {
		if (lastUpdated) {
			const fetchData = async () => {
				try {
					const responseProfile = await userServiceInstance.getFullProfileByProfileId_authed(profile_id);
					setUser(JSON.parse(responseProfile.data));
				} catch(error) {
					console.log(error, 'error');
				}
			}
			fetchData();
		}
    }, [lastUpdated, profile_id, setUser])
	
    if (!user) {
        return <div> loading </div>
	}
	
	const handlerClickWriteMessage = (profile_id: number) => {
		const fetchData = async () => {
			try {
				const response = await userServiceInstance.createPrivateChat(profile_id);
				// if (response.data === 'PrivateChat already exists') {
					
				// }
				history.push("/chat/id=" + response.data);
			} catch(error) {
				console.log(error, 'error');
			}
		}
		fetchData();
	}
	
	
    return ( 
		<div className="profile">
			<div className="actions">
				<div className="img-container">
					<img src={"http://127.0.0.1:8001/static" + user.profile.image } 
						className="profile"
						width="100px"
						height="135px"
						alt="profile"
					/>
				</div>
				<div className="nickname">
					{ user.profile.nickname }
				</div>
				<div className="status">
					{ user.profile.status }
				</div>
				<ReloadProfileContext.Provider value={{'setLastUpdated': setLastUpdated}} >
					<FriendDropdown id={user.profile.id}
									status_code={user.status} 
									related={user.related} 
					/>
				</ReloadProfileContext.Provider>
				<div className="white-message" onClick={() => handlerClickWriteMessage(user.profile.id)}>
					<div className="circle"></div>
					white a message
				</div>
			</div>
			<div className="bio">
				<div className="quote">
					{ user.profile.main_quote }
				</div>
				<div className="info">
					<div>
						<div>
							sex:
						</div>
						<div>
							date of birth:
						</div>
						<div>
							location: 
						</div>
						<div>
							profession: 
						</div>
					</div>	
					<div>	
						<div>
						{user.profile.sex === "ML" 
						? "male"
						: (user.profile.sex === "FM" 
						? "female"
						: (user.profile.sex === "OT" 
						? "other"
						: null
						))}
						</div>	
						<div>
							{ user.profile.date_of_birth }
						</div>
						<div>
							{ user.profile.location }
						</div>
						<div>
							{ user.profile.profession }
						</div>	
					</div>
				</div>				
			</div>
		</div>
    );
}

export default Profile;