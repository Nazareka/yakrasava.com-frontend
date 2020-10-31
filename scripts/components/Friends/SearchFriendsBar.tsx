import React, { useState, useEffect, useRef, useContext } from 'react';
import ReloadSearchFriendsResultsContext from '../../contexts/ReloadSearchFriendsResultsContext';
import userServiceInstance from '../../services/UserService';
import TUseState from '../../typescript/TUseState';
 
const SearchFriendsBar = (): JSX.Element => {
    const searchInput = useRef(null);
    const [searchInputVal, setsearchInputVal] = useState('') as TUseState<'' | string>
    const reloadSearchFriendsResultsContext = useContext(ReloadSearchFriendsResultsContext);
    let timer: null | NodeJS.Timeout = null;
    const refTimer = useRef(timer) as React.MutableRefObject<null | NodeJS.Timeout>;

    const handlerClickSearchFriends = (e: any) => {
        e.preventDefault()
        if (e.key === 'Enter') {
            const fetchData = async () => {
                try {
                    const response = await userServiceInstance.getListUsersByQueryString(searchInputVal);
                    if (JSON.parse(response.data) === 'none') {
                        reloadSearchFriendsResultsContext.setListFoundUsers([])
                    } else {
                        const data = JSON.parse(response.data);
                        reloadSearchFriendsResultsContext.setListFoundUsers(data)
                        console.log(data);
                    }
                } catch(error) {
                    console.log(error, 'error');
                }
            }
            fetchData();
        }
    }
    useEffect(() => {
        if (searchInputVal !== '') {
            if (refTimer.current === null) {
                refTimer.current = setTimeout(() => {
                    const fetchData = async () => {
                        try {
                            const response = await userServiceInstance.getListUsersByQueryString(searchInputVal);
                            if (JSON.parse(response.data) === 'none') {
                                reloadSearchFriendsResultsContext.setListFoundUsers([])
                            } else {
                                const data = JSON.parse(response.data);
                                reloadSearchFriendsResultsContext.setListFoundUsers(data)
                                console.log(data);
                            }
                        } catch(error) {
                            console.log(error, 'error');
                        }
                    }
                    fetchData();
                }, 250);
            } else {
                clearTimeout(refTimer.current);
                refTimer.current = setTimeout(() => {
                    const fetchData = async () => {
                        try {
                            const response = await userServiceInstance.getListUsersByQueryString(searchInputVal);
                            if (JSON.parse(response.data) === 'none') {
                                reloadSearchFriendsResultsContext.setListFoundUsers([])
                            } else {
                                const data = JSON.parse(response.data);
                                reloadSearchFriendsResultsContext.setListFoundUsers(data)
                                console.log(data);
                            }
                        } catch(error) {
                            console.log(error, 'error');
                        }
                    }
                    fetchData();
                }, 250);
            }
            console.log(searchInputVal)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInputVal])

    return (  
        <form className="search-container">
            <input  type="text" 
                    className="search-bar" 
                    placeholder="find a friend" 
                    ref={searchInput} 
                    value={searchInputVal} 
                    onChange={
                        (e) => {
                            const target = e.target as HTMLInputElement; 
                            return setsearchInputVal(target.value);
                        }
                    }
                    />
            <span onClick={(e) => handlerClickSearchFriends(e)} >
                <img className="search-icon" src="http://www.endlessicons.com/wp-content/uploads/2012/12/search-icon.png" alt="search-icon" />
            </span>
        </form>
    );
}
 
export default SearchFriendsBar;