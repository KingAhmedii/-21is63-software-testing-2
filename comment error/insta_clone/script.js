document.addEventListener('DOMContentLoaded', function() {
    const likeButtons = document.querySelectorAll('.like-button');
    const shareButtons = document.querySelectorAll('.share-button');
    const viewCommentsButtons = document.querySelectorAll('.view-comments-button');
    const commentInputs = document.querySelectorAll('.comment-input');
    const commentSubmits = document.querySelectorAll('.comment-submit');

    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('liked');
            if (this.classList.contains('liked')) {
                this.classList.replace('fa-regular', 'fa-solid');
            } else {
                this.classList.replace('fa-solid', 'fa-regular');
            }
        });
    });

    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('shared');
        });
    });

    viewCommentsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.closest('.post-main').dataset.postId;
            const commentsSection = this.nextElementSibling;
            fetchCommentsFromDatabase(postId, commentsSection);
        });
    });

    commentSubmits.forEach((button, index) => {
        button.addEventListener('click', function() {
            const postId = this.closest('.post-main').dataset.postId;
            const commentInput = commentInputs[index];
            const comment = commentInput.value;
            if (comment) {
                saveCommentToDatabase(postId, comment, function() {
                    commentInput.value = '';
                    fetchCommentsFromDatabase(postId, button.closest('.post-description').querySelector('.comments-section'));
                });
            }
        });
    });
});

function saveCommentToDatabase(postId, comment, callback) {
    fetch('/save_comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId, comment })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        if (callback) callback();
    })
    .catch((error) => console.error('Error:', error));
}

function fetchCommentsFromDatabase(postId, commentsSection) {
    fetch(`/get_comments?postId=${postId}`)
    .then(response => response.json())
    .then(data => {
        commentsSection.innerHTML = '';
        data.comments.forEach(comment => {
            const commentElement = document.createElement('p');
            commentElement.textContent = comment;
            commentsSection.appendChild(commentElement);
        });
    })
    .catch((error) => console.error('Error:', error));
}
