interface Bookmark {
    id: string;
    title: string;
    url: string;
    description?: string;
    category?: string;
    created: string;
}

const _apiLink = 'http://localhost:3001/bookmarks';

export const getBookmarksdata = async (): Promise<Bookmark[]> => {
    try {
        const response = await fetch(_apiLink, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        throw error;
    }
};

export const addBookmark = async (bookmark: Omit<Bookmark, 'id' | 'created'>): Promise<Bookmark> => {
    try {
        const response = await fetch(_apiLink + "/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookmark)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to add bookmark:", error);
        throw error;
    }
};

export const editBookmark = async (id: string, bookmark: Partial<Bookmark>): Promise<Bookmark> => {
    try {
        const response = await fetch(_apiLink + "/edit/" + id, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookmark)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to edit bookmark:", error);
        throw error;
    }
};

export const removeBookmark = async (id: string): Promise<void> => {
    try {
        const response = await fetch(_apiLink + "/remove/" + id, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to remove bookmark:", error);
        throw error;
    }
};

export type { Bookmark };