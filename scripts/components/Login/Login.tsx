import React from 'react'
import userServiceInstance from '../../services/UserService'
import { Link } from "react-router-dom"

const Login = (): JSX.Element => {
	const handleFormSubmit = (event: any) => {
		event.preventDefault()
    	const formData: any = new FormData(event.target)
    	const [email, password] = formData
    	const userData = {
            'email': email[1],
            'password': password[1],
        }
        const validation = () => {
            let is_valid = false
            // eslint-disable-next-line no-useless-escape
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userData.email)) {
                alert('email is not valid')
            } else if (userData.password.length < 8) {
                alert('password must be more than 8 characters')
            } else {
                is_valid = true
            }
            return is_valid

        }
        if (validation() === true) {
            const fetchData = async () => {
                try {
                    const response = await userServiceInstance.loginUser(userData)
                    localStorage.setItem('refresh', response.data.refresh)
                    localStorage.setItem('access', response.data.access)
                    window.location.href = "http://localhost:3000/"
                } catch(error) {
                    alert("bad password or email")
                }
            }
            fetchData()
        }
   	}
	return (
		<div className="form-body">
            <div className="form-container">
                <div className="title">
                    sign in
                </div>
                <form onSubmit={handleFormSubmit}>
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
                    <button type="submit">
                        <span>
                            sign in
                        </span>
                    </button>
                    <button>
                        <Link to="/registration">
                            registration
                        </Link>
                    </button>
                </form>
            </div>
      </div>
	)
}

export default Login