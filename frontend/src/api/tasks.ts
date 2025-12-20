export async function fetchTasks(token: string) {
    const res = await fetch("http://localhost:5000/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch tasks");
    }
  
    return res.json();
  }
  