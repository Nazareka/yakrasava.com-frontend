import { TStatus, TRelated } from './relashionshipTypeSet';

export interface IAuth {
	isAuthOver: boolean,
	isLoggedIn: boolean,
	profile_id: null | number,
	networkError: boolean,
	isWebSocketConnected: boolean
}
export interface IShortProfile {
    id: number,
    nickname: string,
    image: string,
    status: string
}

export interface IFullProfile {
	id: number, 
	nickname: string, 
	main_quote: string, 
	profession: string, 
	location: string, 
	sex: string, 
	date_of_birth: string, 
	image: string, 
	status: string
}

export interface IUser {
	profile: IFullProfile
	related: TRelated,
	status: TStatus
}