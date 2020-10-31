import React, { useState, useRef, Fragment, useEffect, MutableRefObject } from 'react'
import userServiceInstance from '../../services/UserService'
import handlerCropAndMoveImage from "../../tools/handlerCropAndMoveImage"
import TUseState from '../../typescript/TUseState'

interface handleImageCropProps { 
    canvas: MutableRefObject<HTMLCanvasElement | null>, 
    canvasImg: MutableRefObject<HTMLImageElement | null>
}

interface TUserImage {
    url: any
}

const CreateProfile = () => {
    const canvas = useRef(null) as MutableRefObject<HTMLCanvasElement | null>
    const canvasFrame = useRef(null) as MutableRefObject<HTMLCanvasElement | null>
    const canvasImg = useRef(null) as MutableRefObject<HTMLImageElement | null>
    const img = useRef(null)
    const [userImage, setUserImage] = useState({
        url: null
    }) as TUseState<TUserImage>
    const [test, setTest] = useState({
        url: false
    })
    const [userImageResult, setUserImageResult] = useState(null) as TUseState<null | string | Blob>
	const handleFormSubmit = (event: any) => {
        event.preventDefault()
        const formData: any = new FormData(event.target)
        const [, location, gender, date_of_birth] = formData
        const dataProfile: any = new FormData()
        dataProfile.append('location', location[1])
        dataProfile.append('sex', gender[1])
        dataProfile.append('date_of_birth', date_of_birth[1])
        dataProfile.append('image', userImageResult)
        const fetchData = async () => {
            try {
                const response = await userServiceInstance.createProfile(dataProfile)
                window.location.href = "http://localhost:3000/"
                console.log('response', response) 
            } catch(error) {
                if (error.data.response === 'profile is not valid') {
                    alert("server error. Please reload page")
                } else if (error.data.response === 'validation_error') {
                    alert("server error. Please reload page")
                }
                console.log('error', error)
            }
        }
        fetchData()
   	}
    
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
        let reader = new FileReader()
        let file = event!.target!.files![0]
        reader.onloadend = () => {
            setUserImage({
                url: reader.result
            })
        }
        reader.readAsDataURL(file)
    }

    const handleImageCrop = ({ canvas, canvasImg }: handleImageCropProps): void => {
        const currentCanvasUrl = canvas!.current!.toDataURL("image/png")
        canvasImg!.current!.src = currentCanvasUrl
        setTest({
            url: true
        })
    }
    const dataURItoBlob = (dataURI: any) =>  {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1])
        else
            byteString = unescape(dataURI.split(',')[1])
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split('')[0]
    
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length)
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ia], {type:mimeString})
    }

    useEffect(() => {
        if (test.url !== false) {
            const newCanvas: any = document.createElement("CANVAS")
            const left = -((canvas!.current!.width - 300) / 2),
                  top =  -((canvas!.current!.height - 405) / 2)
            newCanvas.width = 300
            newCanvas.height = 405
            newCanvas.getContext('2d').drawImage(canvasImg.current, left, top)
            const currentCanvasUrl = newCanvas.toDataURL("image/png")
            setUserImageResult(dataURItoBlob(currentCanvasUrl))
        }
    }, [canvas, canvasImg, test, setUserImageResult])

    useEffect(() => {
        if (userImage.url !== null) {
            handlerCropAndMoveImage(canvas.current, canvasFrame.current, img.current)
        }
    }, [userImage, canvasFrame, canvas])
    

    return (  
        <div>
            <div>
                create profile
            </div>
            <form onSubmit={handleFormSubmit} >
                <div>
                    <div>
                        {(userImage.url !== null) ? 
                        <Fragment>
                            <img src={userImage.url} ref={img} id='imgkek' alt="preloaded-user" 
                                 style={{"display": "none"}} />
                            <div style={{"position": "absolute", "zIndex": 100}}>
                                <div>
                                    <canvas ref={canvasFrame} style={{"border": "1px solid blue"}} />
                                </div>
                            </div> 
                            <div style={{"zIndex": 100, "position": "relative"}}>
                                <div>
                                    <canvas ref={canvas}  />
                                </div>
                            </div>
                            <img ref={canvasImg} alt="prepreloaded-user" style={{"display": "none"}} />
                            <button onClick={() => handleImageCrop({ canvas, canvasImg })} >
                                crop
                            </button>
                        </Fragment>
                        : null }
                    </div>
                    <label>
                        Profile photo
                        <input className="fileInput" 
                               type="file" 
                               name="image"
                               onChange={ (event) => {handleImageUpload(event)}} 
                        />
                    </label>
                </div>
                <div>
                    <label>
                        location
                        <input type="text" name="location" required/>
                    </label>
                </div>
                <div>
                    <label>
                        sex
                    </label>
                    <div>
                        <input type="radio" id="male" name="gender" value="ML" />
                        <label htmlFor="male">man</label>
                    </div>
                    <div>
                        <input type="radio" id="female" name="gender" value="FM" />
                        <label htmlFor="female">female</label>
                    </div>
                    <div>
                        <input type="radio" id="other" name="gender" value="OT" />
                        <label htmlFor="other">other</label>
                    </div>
                </div>
                <div>
                    <label>
                        date of birth
                        <input type="date" id="start" name="date_of_birth"
                                defaultValue="2000-01-01"
                                min="1900-01-01" max="2018-12-31" />
                    </label>
                </div>
                <button type="submit">
                    <span>
                        sign up
                    </span>
                </button>
            </form>
      </div>
    )
}
 
export default CreateProfile