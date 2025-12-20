import { useEffect, Dispatch, SetStateAction } from "react";
import { socket } from "../socket";
import { Task } from "../types/task";

export const useTaskSocket = (
  setTasks: Dispatch<SetStateAction<Task[]>>
) => {
  useEffect(() => {
    socket.on("task:created", (task: Task) => {
      setTasks((prev) => [task, ...prev]);
    });

    socket.on("task:updated", (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    });

    socket.on("task:assigned", (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    });

    socket.on("task:deleted", ({ id }: { id: string }) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });

    return () => {
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:assigned");
      socket.off("task:deleted");
    };
  }, [setTasks]);
};
