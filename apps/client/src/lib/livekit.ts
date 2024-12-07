
export class LiveKitClient{
    private static token:string|undefined;
    private static listeners: Set<(token:string|undefined)=>void> = new Set()
    static setToken = (token:string)=>{
        this.token = token
        this.listeners.forEach((cb)=>{cb(this.token)})
    }
    static subscribe = (cb:(token:string|undefined)=>void)=>{
        this.listeners.add(cb)
        return ()=> this.listeners.delete(cb)
    }
    static getToken = ()=>{
        return this.token
    }
    
}