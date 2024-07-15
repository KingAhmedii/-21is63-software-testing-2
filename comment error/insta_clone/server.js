const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let db = new sqlite3.Database(path.join(__dirname, 'comments.db'), (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, postId INTEGER, comment TEXT)");
});

app.post('/save_comment', (req, res) => {
    const { postId, comment } = req.body;
    db.run(`INSERT INTO comments(postId, comment) VALUES(?, ?)`, [postId, comment], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.json({ message: 'Comment saved', id: this.lastID });
    });
});

app.get('/get_comments', (req, res) => {
    const postId = req.query.postId;
    db.all("SELECT comment FROM comments WHERE postId = ?", [postId], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json({ comments: rows.map(row => row.comment) });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
