import { AccessToken,VideoGrant} from 'livekit-server-sdk';

export const generateToken = async (roomName:string,participantName:string)=>{
    const apiKey = process.env.LIVEKIT_API_KEY
    const secretKey = process.env.LIVEKIT_SECRET_KEY
    const token = new AccessToken(apiKey,secretKey,{identity:participantName})
    const videoGrant:VideoGrant = {
        room: roomName,
        roomJoin: true,
        canPublish:true,
        canSubscribe:true
    }
    token.addGrant(videoGrant)
    return await token.toJwt()
}