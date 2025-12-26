export async function fetchTasks(token: string) {
    const res = await fetch("https://collaborative-task-manager-phxp.onrender.com/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch tasks");
    }
  
    return res.json();
  }
  