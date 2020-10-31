import React, {useEffect, useState} from 'react';
import userServiceInstance from '../../services/UserService';
import TUseState from '../../typescript/TUseState';
import { IFullProfile } from '../../typescript/usersProfileTypeSet';

const MyProfile = (): JSX.Element => {
	
	const [profile, setProfile] = useState(null) as TUseState<null | IFullProfile>;

    useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await userServiceInstance.getFullProfileCurrentUser();

				setProfile(JSON.parse(response.data));
			} catch(error) {
				console.log(error, 'error');
			}
		}
		fetchData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

    if (!profile) {
        return <div> loading </div>
	}
	
    return (
		<div className="profile">
			<div className="actions">
				<div className="img-container">
					<img src={"http://127.0.0.1:8001/static" + profile.image} 
						width="100px" 
						height="135px" 
						className="my-profile" 
						alt="profile-logo" />
				</div>
				<div className="nickname">
					{ profile.nickname }
				</div>
				<div className="status">
					{ profile.status }
				</div>
			</div>
			<div className="bio">
				<div className="quote">
					{ profile.main_quote }
				</div>
				<div className="info">
					<div>
						<div>
							Стать:
						</div>
						<div>
							Дата народження:
						</div>
						<div>
							Локація: 
						</div>
						<div>
							Професія: 
						</div>
					</div>
					<div>	
						<div>
						{profile.sex === "ML" 
						? "male"
						: (profile.sex === "FM" 
						? "female"
						: (profile.sex === "OT" 
						? "other"
						: null
						))}
						</div>	
						<div>
							{ profile.date_of_birth }
						</div>
						<div>
							{ profile.location }
						</div>
						<div>
							{ profile.profession }
						</div>	
					</div>	
				</div>					
			</div>
			<div></div>
		</div>
    );
}
 
export default MyProfile;