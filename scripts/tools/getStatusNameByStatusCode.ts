import { TRelated, TStatus } from "../typescript/relashionshipTypeSet"

interface getStatusNameByStatusCodeProps {
    status_code: TStatus,
    related: TRelated
}

const getStatusNameByStatusCode = ({ status_code, related}: getStatusNameByStatusCodeProps): string => {

    if (status_code === 'friend'){
        return 'friend'
    } else if (status_code === 'close_friend'){
        return 'close friend'   
    } else if (status_code === 'relative'){
        return 'relative'    
    } else if (status_code === 'beloved'){
        return 'beloved'    
    } else if (status_code === 'follow' && related === 'to'){
        return 'follower'     
    } else if (status_code === 'follow' && related === 'from') {
        return 'follow'          
    } else if (status_code === 'none' && related === 'none') {
        return ''           
    } else {
        throw new Error('unexpected error: getStatusNameByStatusCode');
    }
}

export default getStatusNameByStatusCode;