import axios, { AxiosInstance, AxiosResponse } from 'axios';

// type TAxiosInstanceType = 'unauthed' | 'authed' | 'create_profile';

class UserService {
	private API_URL: string = 'http://127.0.0.1:8001';
	private axiosInstanceUnAuth: AxiosInstance;
	private axiosInstanceCreateProfile: AxiosInstance;
	private axiosInstance: AxiosInstance;
	private accessToken: null | string;
	private static userService: null | UserService = null;
    constructor(){
		this.updateAccessToken();
	}

	public static getInstance(): UserService {
		return this.userService
			? this.userService
			: this.userService = new UserService()
	}

	public updateAccessToken() {
		this.accessToken = localStorage.getItem('access');
		this.axiosInstanceUnAuth = axios.create({
		    baseURL: this.API_URL,
		    timeout: 5000,
		    headers: {
		        'Content-Type': 'application/json',
		        'accept': 'application/json'
		    }
		});
		this.axiosInstanceCreateProfile = axios.create({
		    baseURL: this.API_URL,
		    timeout: 5000,
		    headers: {
		        'Authorization': "Bearer " + this.accessToken,
				'content-type': 'multipart/form-data; boundary=-------------573cf973d5228 ',
				'accept': 'application/json'
		    }
		});
		this.axiosInstance = axios.create({
		    baseURL: this.API_URL,
		    timeout: 5000,
		    headers: {
		        'Authorization': "Bearer " + this.accessToken,
				'Content-Type': 'application/json',
				'accept': 'application/json'
		    }
		});
	}
	
	private ConnectionMiddleware(axiosRequest: Function) {
		return axiosRequest().then(
			(response: any) => response,	
			(error: any) => {
				const freshToken = localStorage.getItem('refresh'); 
		      	const dataFreshToken = {
		        	'refresh': freshToken,
				}
				return this.getAccessToken(dataFreshToken).then(
					refresh_response => {
						localStorage.setItem('access', refresh_response.data.access);
						localStorage.setItem('refresh', refresh_response.data.refresh);
						this.updateAccessToken(); 
						console.log("updateAccessToken");
						return axiosRequest().then((response1: any) => response1);
					},
					error => {
						if (error.response.data.detail === "Token is invalid or expired") {
							alert("your session was over, please re sign in");
						}
					}
				);
			}
		);
	}


    public createUser(user: any): Promise<AxiosResponse<any>> {
    	const url = '/api/create_user/';
    	return this.axiosInstanceUnAuth.post(url, user);
    }
    public loginUser(user: any) {
    	const url = '/api/token/';
    	return this.axiosInstanceUnAuth.post(url, user);
    }
    public getAccessToken(freshToken: any) {
    	const url = '/api/token/refresh/';
    	return this.axiosInstanceUnAuth.post(url, freshToken).then(response => response);
    }
    public getProfileIdCurrentUser() {
    	const url = 'api/get_profile_id_by_current_user/';
    	return this.axiosInstance.get(url).then(response => { return { data: response.data.message }});	
	}
	public createProfile(userProfile: any) {
    	const url = 'api/create_profile/';
    	return this.axiosInstanceCreateProfile.post(url, userProfile).then(response => response);
	}
	public getProfileCurrentUser() {
    	const url = 'api/get_profile_current_user/';
    	return this.ConnectionMiddleware(() => this.axiosInstance.get(url));
	}
	public changeRelationship(data: any) {
    	const url = 'api/change_relationship/';
    	return this.ConnectionMiddleware(() => this.axiosInstance.post(url, data));
	}
	public getListFriendsByCurrentUser() {
    	const url = 'api/get_list_friends_current_user/';
    	return this.ConnectionMiddleware(() => this.axiosInstance.get(url));
	}
	public getListFollowersByCurrentUser() {
    	const url = 'api/get_list_followers_current_user/';
    	return this.ConnectionMiddleware(() => this.axiosInstance.get(url));
	}
	public getListFollowsByCurrentUser() {
    	const url = 'api/get_list_follows_current_user/';
    	return this.ConnectionMiddleware(() => this.axiosInstance.get(url));
	}
	public getFullProfileByProfileId_authed(profile_id: any) {
    	const url = `api/get_full_profile_by_profile_id_authed/`;
		return this.ConnectionMiddleware(() => this.axiosInstance.get(url,
			{ 
				params: {'profile_id': profile_id}
			}
		));
	}
	public getFullProfileCurrentUser() {
    	const url = `api/get_full_profile_current_user/`;
		return this.ConnectionMiddleware(() => this.axiosInstance.get(url));
	}
	// getListFriends() {
    // 	const url = `api/get_list_users`;
    // 	return this.axiosInstance.get(url).then(response => response);
	// }
	public getListUsersByQueryString(query_string: any) {
    	const url = `api/get_list_users_by_query_string/`;
    	return this.ConnectionMiddleware(() => this.axiosInstance.get(url,
			{ 
				params: {'query_string': query_string}
			}
		));
	}
	public getListUsersByArrayIds(array_ids: any) {
    	const url = `api/get_list_users_by_array_ids/`;
    	return this.ConnectionMiddleware(() => this.axiosInstance.get(url,
			{ 
				params: {'array_ids': array_ids}
			}
		));
	}

	public createSavedMessagesChat() {
    	const url = `api/create_saved_messages_chat/`;
    	return this.ConnectionMiddleware(() => this.axiosInstance.post(url));
	}
	public createPrivateChat(profile_id: any) {
    	const url: string = `api/create_private_chat/`;
    	return this.ConnectionMiddleware(() => this.axiosInstance.post(url, {profile_id: profile_id}));
	}

	public getAllChats() {
		const url = `api/get_all_chats/`;
		return this.ConnectionMiddleware(() => this.axiosInstance.get(url));
	}

	public getChatById(chat_id: any) {
    	const url = `api/get_chat_by_id/`;
    	return this.ConnectionMiddleware(() => this.axiosInstance.get(url,
			{ 
				params: {'chat_id': chat_id}
			}
		));
	}

	public getMessagesByChatId(chat_id: any) {
    	const url = `api/get_messages_by_chat_id/`;
    	return this.ConnectionMiddleware(() => this.axiosInstance.get(url,
			{ 
				params: {'chat_id': chat_id}
			}
		));
	}

	public create_message(text: any, chat_id: any) {
    	const url = `api/create_message/`;
    	return this.ConnectionMiddleware(() => this.axiosInstance.post(url, {
			text: text,
			chat_id: chat_id
		}));
	}
}

let userServiceInstance: UserService = UserService.getInstance();

export type TUserService = UserService;
export default userServiceInstance;