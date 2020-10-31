import React, { useContext } from 'react';
import userServiceInstance from '../../services/UserService';
import ReloadProfileContext from '../../contexts/ReloadProfileContext';

interface IAtrFriendActions {
    id: number,
    action_code: string,
    action_name: string
}
interface IhandleChangeRelationsip {
    id: number,
    action_code: string
}
interface IData {
    another_profile_id: number,
    action: string
}

const FriendActions = ({ id, action_code, action_name }: IAtrFriendActions): JSX.Element => {

    const reloadProfileContext = useContext(ReloadProfileContext);
    
    const handleChangeRelationship = ({ id, action_code }: IhandleChangeRelationsip) => {
        const fetchData = async () => {
            try {
                const data: IData = {
                    "another_profile_id": id,
                    "action": action_code
                }
                await userServiceInstance.changeRelationship(data);
                reloadProfileContext.setLastUpdated(Date.now())
            } catch(error) {
                console.log(error, 'error');
            }
        }
        fetchData();
    }
    
    return (
        <div 
            onClick={() => handleChangeRelationship({id, action_code})}
            className="action"
        >
            { action_name }
        </div>
    );
}
 
export default FriendActions;