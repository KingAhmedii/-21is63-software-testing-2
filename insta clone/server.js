const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const commentsFilePath = path.join(__dirname, 'comments.json');

// Helper function to read comments from JSON file
function readCommentsFromFile(callback) {
    fs.readFile(commentsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading comments file:', err);
            callback([]);
            return;
        }
        try {
            const comments = JSON.parse(data);
            callback(comments);
        } catch (error) {
            console.error('Error parsing comments file:', error);
            callback([]);
        }
    });
}

// Helper function to write comments to JSON file
function writeCommentsToFile(comments, callback) {
    fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing comments file:', err);
            callback(false);
            return;
        }
        callback(true);
    });
}

app.post('/save_comment', (req, res) => {
    const { postId, comment } = req.body;
    console.log(`Received request to save comment: postId=${postId}, comment=${comment}`);
    readCommentsFromFile((commentsData) => {
        commentsData.comments.push({ postId, comment });
        writeCommentsToFile(commentsData, (success) => {
            if (success) {
                console.log('Comment saved successfully');
                res.json({ message: 'Comment saved' });
            } else {
                console.error('Failed to save comment');
                res.status(500).json({ error: 'Failed to save comment' });
            }
        });
    });
});

app.get('/get_comments', (req, res) => {
    const postId = req.query.postId;
    console.log(`Received request to get comments for postId=${postId}`);
    readCommentsFromFile((commentsData) => {
        const comments = commentsData.comments.filter(comment => comment.postId == postId);
        res.json({ comments: comments.map(comment => comment.comment) });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
