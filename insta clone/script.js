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
            console.log(`View comments button clicked for postId: ${postId}`);
            fetchCommentsFromLocalStorage(postId, commentsSection);
        });
    });

    commentSubmits.forEach((button, index) => {
        button.addEventListener('click', function() {
            const postId = this.closest('.post-main').dataset.postId;
            const commentInput = commentInputs[index];
            const comment = commentInput.value;
            if (comment) {
                console.log(`Posting comment for postId: ${postId}, comment: ${comment}`);
                saveCommentToLocalStorage(postId, comment, function() {
                    commentInput.value = '';
                    fetchCommentsFromLocalStorage(postId, button.closest('.post-description').querySelector('.comments-section'));
                });
            }
        });
    });
});

function saveCommentToLocalStorage(postId, comment, callback) {
    console.log(`Attempting to save comment for postId: ${postId}, comment: ${comment}`);
    const commentsData = JSON.parse(localStorage.getItem('commentsData')) || { comments: [] };
    commentsData.comments.push({ postId, comment });
    localStorage.setItem('commentsData', JSON.stringify(commentsData));
    console.log('Success:', commentsData);
    if (callback) callback();
}

function fetchCommentsFromLocalStorage(postId, commentsSection) {
    console.log(`Fetching comments for postId: ${postId}`);
    const commentsData = JSON.parse(localStorage.getItem('commentsData')) || { comments: [] };
    const comments = commentsData.comments.filter(comment => comment.postId == postId);
    commentsSection.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = document.createElement('p');
        commentElement.textContent = comment.comment;
        commentsSection.appendChild(commentElement);
    });
}
