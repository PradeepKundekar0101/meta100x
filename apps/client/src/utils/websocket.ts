import { SOCKET_URL } from "@/config/configurations";

export interface Player {
  avatarId: string;
  userName: string;
  userId: string;
}

export interface WebSocketMessage {
  type: string;
  payload: object;
}

type MessageListener = (msg: WebSocketMessage) => void;

export class WebSocketSingleton {
  private static instance: WebSocket | null = null;
  private static players: Player[] = [];
  private static listeners: Map<string, Set<MessageListener>> = new Map();

  static getInstance() {
    if (!this.instance || this.instance.readyState === WebSocket.CLOSED) {
      this.instance = new WebSocket(SOCKET_URL);

      this.instance.addEventListener("message", (event) => {
        try {
          const parsedMessage = JSON.parse(event.data);
          this.notifyListeners(parsedMessage);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      });
    }

    return this.instance;
  }

  static subscribe(eventType: string, listener: MessageListener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);
    return () => this.unsubscribe(eventType, listener);
  }

  static unsubscribe(eventType: string, listener: MessageListener) {
    const typeListeners = this.listeners.get(eventType);
    if (typeListeners) {
      typeListeners.delete(listener);
    }
  }

  private static notifyListeners(message: WebSocketMessage) {
    const listenersForType = this.listeners.get(message.type);
    if (listenersForType) {
      listenersForType.forEach((listener) => listener(message));
    }
  }

  static setPlayers(player: Player) {
    this.players.push(player);
  }

  static removePlayer(userId: string) {
    this.players = this.players.filter((e) => e.userId !== userId);
  }

  static clearPlayers() {
    this.players = [];
  }

  static getPlayers() {
    return this.players;
  }
}
