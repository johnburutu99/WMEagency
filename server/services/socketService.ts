import { Server } from "socket.io";
import { Server as HttpServer } from "http";

class SocketService {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    this.initialize();
  }

  private initialize() {
    this.io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("join-room", (bookingId: string) => {
        socket.join(bookingId);
        console.log(`User ${socket.id} joined room ${bookingId}`);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  public getIO(): Server {
    return this.io;
  }
}

export { SocketService };
