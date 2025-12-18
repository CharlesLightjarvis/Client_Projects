import Echo from "laravel-echo";
import Pusher from "pusher-js";
import api from "./api";

// Make Pusher available globally
window.Pusher = Pusher;

// TypeScript declaration for global Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

// Set up and export the Echo instance
const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY as string,
  wsHost: import.meta.env.VITE_REVERB_HOST as string,
  wsPort: (import.meta.env.VITE_REVERB_PORT ?? 80) as number,
  wssPort: (import.meta.env.VITE_REVERB_PORT ?? 443) as number,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
  // authorizer: (channel: any) => {
  //   return {
  //     authorize: (socketId: any, callback: any) => {
  //       api
  //         .post("/api/broadcasting/auth", {
  //           socket_id: socketId,
  //           channel_name: channel.name,
  //         })
  //         .then((response) => {
  //           callback(false, response.data);
  //         })
  //         .catch((error) => {
  //           callback(true, error);
  //         });
  //     },
  //   };
  // },
});

export default echo;
