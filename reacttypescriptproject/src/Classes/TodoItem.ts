import Priority from "./Priority.ts";

class TodoItem {
    priority: Priority;

    name: string;

    description: string;

    created: Date;

    doneBy?: Date;

    constructor(priority?: Priority, name?: string, description?: string, created?: Date, doneBy?: Date) {
        this.priority = priority ?? Priority.Reminder;
        this.name = name ?? '';
        this.description = description ?? '';
        this.created = created ?? new Date();
        this.doneBy = doneBy;
    }

    static mapToTodoItems(data: any[]) {
        return data.map(item =>
            new TodoItem(
                item.priority,
                item.name,
                item.description,
                new Date(item.created),
                item.doneBy ? new Date(item.doneBy) : undefined

            )
        );
    }
}

export default TodoItem;