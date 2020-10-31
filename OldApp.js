import React, { useState, useEffect, useRef } from 'react';
import logo from './images/logo.png';
import './sass/nav.sass';
import MainHandle from './scripts/MainHandle';
import UserService  from  './UserService';
import ModalAuth from './scripts/ModalAuth';
import { ModalContext } from './scripts/ModalContext';

import RegistrationForm from './scripts/auth/RegistrationForm';
import LoginForm from './scripts/auth/LoginForm';
 
const userService = new UserService();

function App() {

  const [block, setBlock] = useState('my profile');
  const [showModal, setShowModal] = useState(false);
  const rootDiv = useRef(null);
  const modalButtonDiv = useRef(null);

  const [isLogged, setIsLogged] = useState(false);
  // const [usersList, setUsersList] = useState([]);

  // useEffect(() => {
  //   userService.getUsers().then(function (result) {
  //       setUsersList(result.data);
  //   });
  // }, []);
  if (false) {
    return (
      <RegistrationForm />
    );
  }
  if (true) {
    return (
      <LoginForm />
    );    
  }

  return (
    <div ref={rootDiv}>
      <header className="header">
        <img src={logo} className="logo" >
        </img>
        <button ref={modalButtonDiv} className="auth" onClick={() => setShowModal(!showModal)}>войти</button>
      </header>

      <content className="content" >
        <nav className="nav"> 
          <div className={"nav-block nav-block-top" + ((block === 'my profile') ? " nav-block-active" : "")} 
                onClick={() => setBlock('my profile')} >
            Мій профіль
          </div>
          <div className={"nav-block nav-block-inside" + ((block === 'my news') ? " nav-block-active" : "")}
                onClick={() => setBlock('my news')} >
            Моя стіна
          </div>
          <div className={"nav-block nav-block-inside" + ((block === 'news') ? " nav-block-active" : "")}
                onClick={() => setBlock('news')} >
            Новини
          </div>
          <div className={"nav-block nav-block-inside" + ((block === 'massage') ? " nav-block-active" : "")}
                onClick={() => setBlock('massage')} >
            Повідомлення
          </div>
          <div className={"nav-block nav-block-inside" + ((block === 'images') ? " nav-block-active" : "")}
                onClick={() => setBlock('images')} >
            Фотографії
          </div>
          <div className={"nav-block nav-block-bottom" + ((block === 'videos') ? " nav-block-active" : "")}
                onClick={() => setBlock('videos')} >
            Відео
          </div>
        </nav>
        <main className="main">
          <MainHandle page={block} />
        </main>
        <aside style={{background: 'orange'}}>
        </aside>
      </content>
      <ModalContext.Provider value={{showModal, setShowModal, rootDiv,modalButtonDiv}} >
        <ModalAuth show={showModal} />
      </ModalContext.Provider>
    </div>
  );
}

export default App;
