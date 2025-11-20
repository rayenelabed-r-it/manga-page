// ---------------------------
// Get references to DOM elements
// ---------------------------
// document.getElementById(...) looks in the HTML for elements with the matching id.
// If the element is not found this returns null, so later use of that variable would fail.
const commentInput = document.getElementById("commentInput");
const commentBtn   = document.getElementById("commentBtn");
const commentsList  = document.getElementById("commentsList");

// ---------------------------
// Function: loadComments
// Purpose: read saved comments from browser storage and display them
// ---------------------------
function loadComments() {
    // localStorage.getItem("comments") returns a string or null.
    // We stored JSON (stringified array), so parse it. If null -> use [] as fallback.
    const comments = JSON.parse(localStorage.getItem("comments")) || [];

    // Clear the area where we will place comments so we don't duplicate them.
    commentsList.innerHTML = "";

    // For each comment (a string), create a new element and add it to the page.
    comments.forEach(text => {
        // document.createElement creates a new DOM node (<div>)
        const div = document.createElement("div");
        // Give it a CSS class so it gets styled (uses your CSS .comment)
        div.className = "comment";
        // textContent puts plain text inside the element (safe from HTML injection)
        div.textContent = text;
        // Append the created element to the comments container
        commentsList.appendChild(div);
    });
}

// ---------------------------
// Event listener: when user clicks the publish button
// ---------------------------
commentBtn.addEventListener("click", () => {
    // Read text from textarea. .value is the content string.
    // .trim() removes spaces at start/end so a user who types only spaces is treated as empty.
    const text = commentInput.value.trim();

    // Guard: if the input is empty after trimming, do nothing.
    if (text === "") return;

    // Read stored comments again (or [] if none), push the new text and save.
    // JSON.parse converts stored JSON string -> JavaScript array
    let comments = JSON.parse(localStorage.getItem("comments")) || [];

    // Add the new comment to the array in memory
    comments.push(text);

    // Save the updated array back to localStorage as a string
    // JSON.stringify converts array -> string
    localStorage.setItem("comments", JSON.stringify(comments));

    // Clear the textarea so the user sees it was published
    commentInput.value = "";

    // Refresh the visible list to include the new comment
    loadComments();
});

// ---------------------------
// When the page loads, populate comments from storage
// ---------------------------
loadComments();
