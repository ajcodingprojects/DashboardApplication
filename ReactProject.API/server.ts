import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 3001;
const FILE_PATH = "./todo_items.json";
const NOTES_FILE_PATH = "./notesheet.txt";
const BOOKMARKS_FILE_PATH = "./bookmarks.json";

/**
 * Run this file using 
 *      `ts-node server.ts` 
 * or compile it to JavaScript using
 *      `tsc server.ts` 
 * and run the resulting JavaScript file with Node.js.
 */

app.use(cors());
app.use(bodyParser.json());

// Load items
app.get("/todos", (req, res) => {
    try {
        const data = fs.readFileSync(FILE_PATH, "utf-8");
        res.json(JSON.parse(data));
    } catch {
        res.json([]);
    }
});

// Add item
app.post("/todos/add", (req, res) => {
    const newItem = req.body;
    const data = fs.existsSync(FILE_PATH)
        ? JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"))
        : [];
    data.push(newItem);
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 4));
    res.status(201).json(newItem);
});

// Edit Item
app.post("/todos/edit/:name", (req, res) => {
    const toReplace = req.params.name;
    const newItem = req.body;
    const data = fs.existsSync(FILE_PATH)
        ? JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"))
        : [];
    const filtered = data.filter((item: any) => item.name.toLowerCase().replace(/[ '"[\]\\/<>;:)(*&^%$#@!`~?]/g, '') !== toReplace);
    filtered.push(newItem);
    fs.writeFileSync(FILE_PATH, JSON.stringify(filtered, null, 4));
    res.status(201).json(newItem);
});

// Delete item by name
app.delete("/todos/remove", (req, res) => {
    const name = req.body.name;
    const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    const filtered = data.filter((item: any) => item.name !== name);
    fs.writeFileSync(FILE_PATH, JSON.stringify(filtered, null, 4));
    res.status(200).json({ deleted: name });
});

// Get notes content
app.get("/notes", (req, res) => {
    try {
        const data = fs.readFileSync(NOTES_FILE_PATH, "utf-8");
        res.json({ text: data });
    } catch (error) {
        // If file doesn't exist, return empty text
        res.json({ text: "" });
    }
});

// Edit notes content
app.post("/notes/edit", (req, res) => {
    try {
        const { text } = req.body;
        if (text === undefined) {
            return res.status(400).json({ error: "Missing 'text' field in request body" });
        }
        fs.writeFileSync(NOTES_FILE_PATH, text, "utf-8");
        res.status(200).json({ message: "Notes updated successfully", text: text });
    } catch (error) {
        res.status(500).json({ error: "Failed to update notes" });
    }
});

// Get bookmarks
app.get("/bookmarks", (req, res) => {
    try {
        const data = fs.readFileSync(BOOKMARKS_FILE_PATH, "utf-8");
        res.json(JSON.parse(data));
    } catch (error) {
        // If file doesn't exist, return empty array
        res.json([]);
    }
});

// Add bookmark
app.post("/bookmarks/add", (req, res) => {
    try {
        const newBookmark = req.body;
        const data = fs.existsSync(BOOKMARKS_FILE_PATH)
            ? JSON.parse(fs.readFileSync(BOOKMARKS_FILE_PATH, "utf-8"))
            : [];
        
        // Add ID and timestamp
        newBookmark.id = Date.now().toString();
        newBookmark.created = new Date().toISOString();
        
        data.push(newBookmark);
        fs.writeFileSync(BOOKMARKS_FILE_PATH, JSON.stringify(data, null, 4));
        res.status(201).json(newBookmark);
    } catch (error) {
        res.status(500).json({ error: "Failed to add bookmark" });
    }
});

// Edit bookmark
app.post("/bookmarks/edit/:id", (req, res) => {
    try {
        const bookmarkId = req.params.id;
        const updatedBookmark = req.body;
        const data = fs.existsSync(BOOKMARKS_FILE_PATH)
            ? JSON.parse(fs.readFileSync(BOOKMARKS_FILE_PATH, "utf-8"))
            : [];
        
        const index = data.findIndex((item: any) => item.id === bookmarkId);
        if (index !== -1) {
            data[index] = { ...data[index], ...updatedBookmark, id: bookmarkId };
            fs.writeFileSync(BOOKMARKS_FILE_PATH, JSON.stringify(data, null, 4));
            res.status(200).json(data[index]);
        } else {
            res.status(404).json({ error: "Bookmark not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to edit bookmark" });
    }
});

// Delete bookmark
app.delete("/bookmarks/remove/:id", (req, res) => {
    try {
        const bookmarkId = req.params.id;
        const data = fs.existsSync(BOOKMARKS_FILE_PATH)
            ? JSON.parse(fs.readFileSync(BOOKMARKS_FILE_PATH, "utf-8"))
            : [];
        
        const filtered = data.filter((item: any) => item.id !== bookmarkId);
        fs.writeFileSync(BOOKMARKS_FILE_PATH, JSON.stringify(filtered, null, 4));
        res.status(200).json({ deleted: bookmarkId });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete bookmark" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
