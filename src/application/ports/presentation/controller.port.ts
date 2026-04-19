export interface ControllerPort {
  listen(): void;
  sendMessage(to: string, message: string): void;
}
