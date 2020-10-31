import React, { useState } from 'react';
import FriendActions from './FriendActions';
import getActionsByStatus from '../../tools/getActionsByStatus';
import getStatusNameByStatusCode from '../../tools/getStatusNameByStatusCode';
import TUseState from '../../typescript/TUseState';
import { TRelated, TStatus } from '../../typescript/relashionshipTypeSet';


interface IFriendDropdownProps {
    id: number,
    status_code: TStatus,
    related: TRelated
}
type TIsOpenActions = TUseState<boolean>;

const FriendDropdown = ({ id, status_code, related }: IFriendDropdownProps): JSX.Element => {
    
    const [isOpenActions, setIsOpenActions] = useState(false) as TIsOpenActions;

    const actions = getActionsByStatus({ status_code, related });

    const status_name = getStatusNameByStatusCode({ status_code, related })

    const handleOpeningActions = (): void => {
        setIsOpenActions(!isOpenActions)
    }
    
    return (  
        <div className="friend-action" >
            { status_code !== 'none' ? 
                <div className="nickname-wrapper" onClick={() => handleOpeningActions()}>
                    <div className="circle"></div>
                    <div className="status">
                        { status_name }
                    </div>
                </div>
            : null }
            <div className={"actions " + (isOpenActions ? 'actions-active' : '')}>
                { actions.map((action) => 
                    <FriendActions id={id} action_code={action[0]} action_name={action[1]} />
                )}    
            </div>
        </div>
    );
}
 
export default FriendDropdown;