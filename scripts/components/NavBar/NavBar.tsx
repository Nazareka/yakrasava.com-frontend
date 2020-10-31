import React from 'react';
import { useHistory } from "react-router-dom";

interface NavBarProps {
    currentBlock: null | string
}

const NavBar = ({ currentBlock }: NavBarProps): JSX.Element => {

    let history = useHistory();
    const changeBlock = (urlBlock: string) => {
        history.push("/" + urlBlock);
    }
    return (  
        <nav className="nav"> 
            <div className={"nav-block nav-block-top" + ((currentBlock === 'my_profile') ? " nav-block-active" : "")} 
                    onClick={() => changeBlock('my_profile')} >
                <div className="circle"></div>
                <div className="text">Мій профіль</div>                     
            </div>
            {/* <div className={"nav-block nav-block-inside" + ((currentBlock === 'my_news') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('my_news')} >
                <div className="circle"></div>
                <div className="text">Моя стіна</div>
            </div> */}
            {/* <div className={"nav-block nav-block-inside" + ((currentBlock === 'news') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('news')} >
                <div className="circle"></div>
                <div className="text">Новини</div>
            </div> */}
            <div className={"nav-block nav-block-inside" + ((currentBlock === 'chats') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('chats')} >
                <div className="circle"></div>
                <div className="text">Повідомлення</div>
            </div>
            {/* <div className={"nav-block nav-block-inside" + ((currentBlock === 'videos') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('videos')} >
                <div className="circle"></div>
                <div className="text">Групи</div>
            </div> */}
            {/* <div className={"nav-block nav-block-inside" + ((currentBlock === 'images') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('images')} >
                <div className="circle"></div>
                <div className="text">Фотографії</div>
            </div> */}
            {/* <div className={"nav-block nav-block-inside" + ((currentBlock === 'videos') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('videos')} >
                <div className="circle"></div>
                <div className="text">Відео</div>
            </div> */}
            {/* <div className={"nav-block nav-block-inside" + ((currentBlock === 'list_friends') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('list_users')} >
                <div className="circle"></div>
                <div className="text">Список користувачів</div>
            </div> */}
            <div className={"nav-block nav-block-bottom" + ((currentBlock === 'friends') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('friends')} >
                <div className="circle"></div>
                <div className="text">Друзі</div>
            </div>
        </nav>
    );
}
 
export default NavBar;