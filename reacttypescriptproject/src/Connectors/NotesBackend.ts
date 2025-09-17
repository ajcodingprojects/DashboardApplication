const _apiLink = 'http://localhost:3001/notes';

export const getNotes = async (): Promise<string> => {
    try {
        const response = await fetch(_apiLink, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.text || '';
    } catch (error) {
        console.error("Failed to fetch notes:", error);
        throw error;
    }
};

export const saveNotes = async (text: string): Promise<void> => {
    try {
        const response = await fetch(_apiLink + "/edit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to save notes:", error);
        throw error;
    }
};