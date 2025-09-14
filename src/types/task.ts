export interface Task {
    id: string;
    title: string;
    startDate: string;
    completed: boolean;
    createdAt: string;
    description: string;
    importance: number;
    dueDate?: string;
}
