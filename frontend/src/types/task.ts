export type Task = {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
    status: string;
    creatorId: string;
    assignedToId?: string | null;
  };
  