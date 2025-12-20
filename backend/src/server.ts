import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma";
import authRoutes from "./routes/auth";
import { authMiddleware, AuthRequest } from "./middleware/auth";

import http from "http";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();

const app = express();

/* ================= HTTP + SOCKET ================= */
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/* ================= MIDDLEWARE ================= */
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/* ================= AUTH ================= */
app.use("/auth", authRoutes);

app.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true },
  });
  res.json(user);
});

/* ================= TASKS ================= */

/** CREATE TASK */
app.post("/tasks", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, description, dueDate, priority, assignedToId } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        creator: { connect: { id: req.userId! } },
        assignedTo: assignedToId
          ? { connect: { id: assignedToId } }
          : undefined,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    io.emit("task:created", task);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});


/** GET TASKS */
app.get("/tasks", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { creatorId: req.userId },
          { assignedToId: req.userId },
        ],
      },
      orderBy: {
        dueDate: "asc", // ✅ EARLIEST FIRST
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


/** UPDATE STATUS */
app.patch(
  "/tasks/:id/status",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.creatorId !== req.userId && task.assignedToId !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    });

    io.emit("task:updated", updatedTask); // ✅ SOCKET EMIT
    res.json(updatedTask);
  }
);

/** ASSIGN TASK */
app.patch(
  "/tasks/:id/assign",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { assignedToId } = req.body;

    try {
      const updatedTask = await prisma.task.update({
        where: { id },
        data: assignedToId
          ? { assignedTo: { connect: { id: assignedToId } } }
          : {},
      });

      io.emit("task:assigned", updatedTask); // ✅ SOCKET EMIT
      res.json(updatedTask);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Failed to assign task" });
    }
  }
);

/** DELETE TASK */
app.delete(
  "/tasks/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
      const task = await prisma.task.findUnique({ where: { id } });

      // 🔒 If task already deleted
      if (!task) {
        return res.json({ message: "Task already deleted" });
      }

      // 🔒 Only creator can delete
      if (task.creatorId !== req.userId) {
        return res.status(403).json({ error: "Not allowed" });
      }

      await prisma.task.delete({ where: { id } });

      io.emit("task:deleted", { id });
      res.json({ message: "Task deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete task" });
    }
  }
);

/* ================= USERS ================= */
app.get("/users", async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server + Socket running on port ${PORT}`)
);


