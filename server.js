const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const ARCHIVE_FILE = path.join(__dirname, 'archive.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

async function initializeArchive() {
    try {
        await fs.access(ARCHIVE_FILE);
    } catch {
        await fs.writeFile(ARCHIVE_FILE, JSON.stringify([], null, 2));
        console.log('Archive file created');
    }
}

app.get('/api/archive', async (req, res) => {
    try {
        const data = await fs.readFile(ARCHIVE_FILE, 'utf8');
        const archive = JSON.parse(data);
        res.json(archive);
    } catch (error) {
        console.error('Error reading archive:', error);
        res.status(500).json({ error: 'Failed to read archive' });
    }
});

app.post('/api/archive', async (req, res) => {
    try {
        const { image, critique } = req.body;
        
        if (!image || !critique) {
            return res.status(400).json({ error: 'Missing image or critique data' });
        }

        const data = await fs.readFile(ARCHIVE_FILE, 'utf8');
        const archive = JSON.parse(data);

        const entry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            image: image,
            critique: critique
        };

        archive.unshift(entry);

        if (archive.length > 1000) {
            archive.pop();
        }

        await fs.writeFile(ARCHIVE_FILE, JSON.stringify(archive, null, 2));

        res.json({ success: true, entry });
    } catch (error) {
        console.error('Error saving to archive:', error);
        res.status(500).json({ error: 'Failed to save to archive' });
    }
});

app.delete('/api/archive/clear', async (req, res) => {
    try {
        await fs.writeFile(ARCHIVE_FILE, JSON.stringify([], null, 2));
        res.json({ success: true, message: 'Archive cleared' });
    } catch (error) {
        console.error('Error clearing archive:', error);
        res.status(500).json({ error: 'Failed to clear archive' });
    }
});

app.delete('/api/archive/:id', async (req, res) => {
    try {
        const data = await fs.readFile(ARCHIVE_FILE, 'utf8');
        let archive = JSON.parse(data);
        
        archive = archive.filter(entry => entry.id !== req.params.id);
        
        await fs.writeFile(ARCHIVE_FILE, JSON.stringify(archive, null, 2));
        
        res.json({ success: true, message: 'Entry deleted' });
    } catch (error) {
        console.error('Error deleting entry:', error);
        res.status(500).json({ error: 'Failed to delete entry' });
    }
});

initializeArchive().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
