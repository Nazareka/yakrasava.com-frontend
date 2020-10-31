import React from 'react';
import { useHistory } from 'react-router-dom';

declare global {
	namespace JSX {
        interface IntrinsicElements {
            content: any,
        }
	}
}

const Content = (block: string): JSX.Element => {
    let history = useHistory();
    const changeBlock = (urlBlock: string) => {
        history.push("/" + urlBlock);
    }
    
    return (  
        <content className="content" >
            <nav className="nav"> 
            <div className={"nav-block nav-block-top" + ((block === 'my profile') ? " nav-block-active" : "")} 
                    onClick={() => changeBlock('my_profile')} >
                Мій профіль                     
            </div>
            <div className={"nav-block nav-block-inside" + ((block === 'my news') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('my_news')} >
                Моя стіна
            </div>
            <div className={"nav-block nav-block-inside" + ((block === 'news') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('news')} >
                Новини
            </div>
            <div className={"nav-block nav-block-inside" + ((block === 'massage') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('massage')} >
                Повідомлення
            </div>
            <div className={"nav-block nav-block-inside" + ((block === 'images') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('images')} >
                Фотографії
            </div>
            <div className={"nav-block nav-block-bottom" + ((block === 'videos') ? " nav-block-active" : "")}
                    onClick={() => changeBlock('videos')} >
                Відео
            </div>
            </nav>
            <main className="main">
            {/* <MainHandle page={block} /> */}
            </main>
            <aside style={{background: 'orange'}}>
            </aside>
        </content>
    );
}
 
export default Content;