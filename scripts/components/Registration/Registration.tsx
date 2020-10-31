import React from 'react';
import userServiceInstance from '../../services/UserService';

const Registration = (): JSX.Element => {
    const handlerLogout = () => {
		localStorage.removeItem('refresh');
		localStorage.removeItem('access');
		window.location.href = "http://localhost:3000/login";
    }
	const handleFormSubmit = (event: any) => {
        event.preventDefault();
    	const formData: any = new FormData(event.target);
    	const [nickname, email, password, reapet_password] = formData;
    	const userData = {
    		user: {
    			nickname: nickname[1].toString(),
	    		email: email[1].toString(),
                password: password[1].toString(),
                reapet_password: reapet_password[1].toString()
    		}
        }
        console.log(userData);
        const validation = () => {
            let is_valid = false;
            if (userData.user.nickname.length < 4) {
                alert('nickname must be more than 4 letters')
            } else if (! /^[a-zA-Z]+$/.test(userData.user.nickname)) {
                alert('nickname must contain not only numbers') 
            // eslint-disable-next-line no-useless-escape
            } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userData.user.email)) {
                alert('email is not valid')
            } else if (userData.user.password.length < 8) {
                alert('password must be more than 8 characters')
            } else if (userData.user.password !== userData.user.reapet_password) {
                alert("passwords aren't the same")
            } else {
                is_valid = true;
            }
            return is_valid;

        }
        if (validation() === true) {
            const fetchData = async () => {
                try {
                    const response = await userServiceInstance.createUser(userData)
                    if (response.data.response === 'profile is not valid') {
                        alert("server error. Please reload page");
                    } else if (response.data.response === 'validation_error') {
                        const messageObject = response.data.message;
                        const firstMessage = messageObject[Object.keys(messageObject)[0]]
                        console.log(firstMessage);
                        alert(firstMessage);
                    } else {
                        handlerLogout()
                    }
                } catch(error) {
                    if (error.data.response === 'profile is not valid') {
                        alert("server error. Please reload page");
                    } else if (error.data.response === 'validation_error') {
                        alert(error.data.message[0])
                    }
                }
            }
            fetchData();
        }
   	}
	return (
		<div className="form-body">
            <div className="form-container">
                <div className="title">
                    Registration
                </div>
                <form onSubmit={handleFormSubmit}>
                    <div className="input_field">
                        <span>
                            <i aria-hidden="true" className="fa fa-user"></i>
                        </span>
                        <input type="text" name="nickname" placeholder="nickname" required />
                    </div>
                    <div className="input_field">
                        <span>
                            <i aria-hidden="true" className="fa fa-envelope"></i>
                        </span>
                        <input type="email" name="email" placeholder="email" required />
                    </div>
                    <div className="input_field">
                        <span>
                            <i aria-hidden="true" className="fa fa-lock"></i>
                        </span>
                        <input type="text" name="password" placeholder="password" required />
                    </div>
                    <div className="input_field">
                        <span>
                            <i aria-hidden="true" className="fa fa-lock"></i>
                        </span>
                        <input type="text" name="reapet_password" placeholder="reapet password" required />
                    </div>
                    <button type="submit">
                        <span>
                            sign up
                        </span>
                    </button>
                </form>
            </div>
      </div>
	);
}

export default Registration;