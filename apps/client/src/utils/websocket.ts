export interface Player{
    avatarId:string,
    userName:string,
    userId:string
}
export class WebSocketSingleton {
    private static instance: WebSocket | null = null;
    private static players: Player[] = [];

    static getInstance(url: string) {
        if (!this.instance || this.instance.readyState === WebSocket.CLOSED) {
            this.instance = new WebSocket(url);
            this.instance.addEventListener("open", () => {
                console.log("WebSocket connection established.");
            });
            this.instance.addEventListener("close", () => {
                this.instance = null; 
            });
        } else if (this.instance.readyState === WebSocket.CONNECTING) {
            console.warn("WebSocket is still connecting. Using the existing instance.");
        }
        return this.instance;
    }

    static setPlayers(player: Player) {
        this.players.push(player);
    }
    static removePlayer(userId:string) {
        this.players = this.players.filter((e)=>e.userId!=userId)
    }
    static clearPlayers(){
        this.players = []
    }
    static getPlayers() {
        return this.players;
    }
}
