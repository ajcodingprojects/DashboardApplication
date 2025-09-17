import TodoItem from "../Classes/TodoItem.ts";
import Priority from "../Classes/Priority.ts";

const _apiLink = 'http://localhost:3001/todos';

export const getTodos = async (setTodoList: any): Promise<void> => {
    try {
        const response = await fetch(_apiLink, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        
        // Map to TodoItems first
        const todoItems = TodoItem.mapToTodoItems(data);
        
        // Sort the todos
        const sortedTodos = todoItems.sort((a: TodoItem, b: TodoItem) => {
            // First, sort by completion date (doneBy)
            // Items with no completion date should come after items with dates
            if (a.doneBy && b.doneBy) {
                // Both have completion dates - sort by nearest date first
                const dateComparison = a.doneBy.getTime() - b.doneBy.getTime();
                if (dateComparison !== 0) {
                    return dateComparison;
                }
            } else if (a.doneBy && !b.doneBy) {
                // a has date, b doesn't - a comes first
                return -1;
            } else if (!a.doneBy && b.doneBy) {
                // b has date, a doesn't - b comes first
                return 1;
            }
            // If both have no dates or dates are equal, sort by priority
            
            // Define priority order: ASAP, High, Medium, Low, Reminder
            const priorityOrder = {
                [Priority.ASAP]: 1,
                [Priority.High]: 2,
                [Priority.Medium]: 3,
                [Priority.Low]: 4,
                [Priority.Reminder]: 5
            };
            
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        setTodoList(sortedTodos);
        // You can now set state with this data if you're in a React component
    } catch (error) {
        console.error("Failed to fetch todos:", error);
    }
};

export const editTodos = async (name: string, editedItem: TodoItem): Promise<void> => {
    try {
        const response = await fetch(_apiLink + "/edit/" + name.toLowerCase().replace(/[ '"[\]\\/<>;:)(*&^%$#@!`~?]/g, ''), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editedItem)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // You can now set state with this data if you're in a React component
    } catch (error) {
        console.error("Failed to edit todos:", error);
    }
};

export const addTodo = async (todo: TodoItem) => {
    await fetch(_apiLink + "/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
    });
};   

export const removeTodo = async (todoName: string) => {
    await fetch(_apiLink + "/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: todoName })
    });
};   