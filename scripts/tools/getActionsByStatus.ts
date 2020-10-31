import { TRelated, TStatus } from "../typescript/relashionshipTypeSet"


interface IAtrGetActionsByStatus {
    status_code: TStatus,
    related: TRelated
}
type IRetGetActionsByStatus = [string, string][]

const getActionsByStatus = ({ status_code, related }: IAtrGetActionsByStatus): IRetGetActionsByStatus => {
    
    if (status_code === 'friend'){
        return [ 
            ['unfriend', 'delete from friends'], 
            ['make_close_friend', 'make close friend'], 
            ['make_relative', 'make a relative'], 
            ['make_beloved', 'make a beloved']
        ]
    } else if (status_code === 'close_friend'){
        return [ 
            ['unmake_close_friend', 'delete from close friends'],
        ]    
    } else if (status_code === 'relative'){
        return [ 
            ['unmake_relative', 'delete from relatives'],
        ]      
    } else if (status_code === 'beloved'){
        return [ 
            ['unmake_beloved', 'delete from beloveds'],
        ]      
    } else if (status_code === 'follow' && related === 'to'){
        return [ 
            ['make_friend', 'make a friend'],
        ]      
    } else if (status_code === 'follow' && related === 'from') {
        return [ 
            ['unfollow', 'unfollow'],
        ]            
    } else if (status_code === 'none' && related === 'none') {
        return [ 
            ['follow', 'follow'],
        ]            
    } else {
        throw new Error('unexpected error: getActionsByStatus');
    }
}
 
export default getActionsByStatus;