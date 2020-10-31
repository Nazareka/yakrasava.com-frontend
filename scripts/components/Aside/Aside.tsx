import React from 'react';

const Aside = (): JSX.Element => {
    // const [showmsg, setShowmsg] = useState(["message this is message"]);
    // useEffect(() => {
    //     setInterval(() => {
    //         setShowmsg(showmsg.push("message this is message"));
    //     }, 2000);
    // }, [])
    // if ( showmsg === null) {
    //     return <div>kek</div>
    // }
    return (  
        <aside className="aside" >
            {/* { console.log(showmsg) }
            { showmsg != null ? showmsg.map((value, i) => 
                <div className="first-message" key={i} >
                { value }
                </div>
            ) : null } */}
            {/* <div className="first-message" >
                message this is message
            </div>
            { showmsg === true ?  
            <div className="first-message" >
                message this is message
            </div> : null } */}
        </aside>
    );
}
 
export default Aside;