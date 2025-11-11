// ===== Load & Save Functions =====
function load(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ===== Ensure Default Users Exist =====
if (!localStorage.getItem("users")) {
    save("users", [
        { username: "admin", password: "admin123", role: "admin" },
        { username: "teacher", password: "teacher123", role: "teacher" },
        { username: "student", password: "student123", role: "student" }
    ]);
}

// ===== LOGIN FUNCTION =====
function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    if (!username || !password) {
        errorMessage.textContent = "Please enter both username and password.";
        errorMessage.style.color = "red";
        return;
    }

    let users = load("users");
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = `${user.role}.html`;
    } else {
        errorMessage.textContent = "Invalid username or password.";
        errorMessage.style.color = "red";
    }
}

// Attach login event listener
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", login);
    }
});

// ===== CHECK LOGIN STATUS =====
function checkLogin(role) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user || user.role !== role) {
        window.location.href = "login.html"; 
    }
}

// ===== LOGOUT FUNCTION =====
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}


// ===== ANNOUNCEMENTS =====

// ===== ANNOUNCEMENTS =====

// Function to add an announcement
function addAnnouncement() {
    const title = document.getElementById('announcementTitle').value.trim();
    const content = document.getElementById('announcementContent').value.trim();
    let announcements = load('announcements');

    if (!title || !content) {
        alert("Please fill all fields.");
        return;
    }

    announcements.push({ title, content });
    save('announcements', announcements);
    
    displayAnnouncements();
    document.getElementById('announcementTitle').value = "";
    document.getElementById('announcementContent').value = "";
}

// Function to load and display announcements
// function displayAnnouncements() {
//     const board = document.getElementById('announcementBoard');
//     const announcementSelect = document.getElementById('announcementSelect');

//     if (!board || !announcementSelect) {
//         console.error("Error: Elements not found!");
//         return;
//     }

// let announcements = JSON.parse(localStorage.getItem('announcements')) || [];

//     // Update the dropdown list
//     announcementSelect.innerHTML = '<option value="">Select an Announcement</option>';
//     announcements.forEach((a, index) => {
//         let option = document.createElement('option');
//         option.value = index;
//         option.textContent = a.title;
//         announcementSelect.appendChild(option);
//     });

//     // Update displayed announcements
//     board.innerHTML = announcements.length === 0 ? "<p>No announcements available.</p>" :
//         announcements.map((a, index) => `
//             <div class="notice-box">
//                 <h3>${a.title}</h3>
//                 <p>${a.content}</p>
//             </div>
//         `).join('');
// }
function displayAnnouncements() {
    const board = document.getElementById('announcementBoard'); 
    const announcementSelect = document.getElementById('announcementSelect'); 

    if (!board) {
        console.error("Error: Announcement board element not found!");
        return;
    }

    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];

    board.innerHTML = ""; // Clear the announcements board

    if (announcements.length === 0) {
        board.innerHTML = "<p>No announcements available.</p>";
    } else {
        announcements.forEach(a => {
            let announcementBox = document.createElement('div');
            announcementBox.classList.add('notice-box'); // Ensure proper styling

            announcementBox.innerHTML = `
                <h3>${a.title}</h3>
                <p>${a.content}</p>
                <small>Added by: ${a.author}</small>
            `;

            board.appendChild(announcementBox);
        });
    }

    // Check if the dropdown exists before modifying it
    if (announcementSelect) {
        announcementSelect.innerHTML = '<option value="">Select an Announcement</option>'; // Reset dropdown

        announcements.forEach((a, index) => {
            let option = document.createElement('option');
            option.value = index;
            option.textContent = a.title;
            announcementSelect.appendChild(option);
        });
    }
}





// Function to load selected announcement into input fields
function loadSelectedAnnouncement() {
    let announcements = load('announcements');
    let selectedIndex = document.getElementById('announcementSelect').value;

    if (selectedIndex !== "") {
        let selectedAnnouncement = announcements[parseInt(selectedIndex)]; // Ensure index is a number
        if (selectedAnnouncement) {
            document.getElementById('announcementTitle').value = selectedAnnouncement.title;
            document.getElementById('announcementContent').value = selectedAnnouncement.content;
        }
    } else {
        document.getElementById('announcementTitle').value = "";
        document.getElementById('announcementContent').value = "";
    }
}


// Function to edit an existing announcement
function editAnnouncement() {
    let announcements = load('announcements');
    let selectedIndex = document.getElementById('announcementSelect').value;

    if (selectedIndex === "") {
        alert("Please select an announcement to edit.");
        return;
    }

    let newTitle = document.getElementById('announcementTitle').value.trim();
    let newContent = document.getElementById('announcementContent').value.trim();

    if (newTitle && newContent) {
        announcements[selectedIndex] = { title: newTitle, content: newContent };
        save('announcements', announcements);
        displayAnnouncements();
        alert("Announcement updated successfully!");
    } else {
        alert("Please fill all fields.");
    }
}

// Function to delete an existing announcement
function deleteAnnouncement() {
    let announcements = load('announcements');
    let selectedIndex = document.getElementById('announcementSelect').value;

    if (selectedIndex === "") {
        alert("Please select an announcement to delete.");
        return;
    }

    announcements.splice(selectedIndex, 1);
    save('announcements', announcements);
    displayAnnouncements();
    alert("Announcement deleted successfully!");
}

// Load announcements when the page loads
document.addEventListener("DOMContentLoaded", function() {
    displayAnnouncements();
});

// ===== NOTICES (Show Both Teacher & Admin Notices) =====
function addNotice() {
    const title = document.getElementById('noticeTitle').value.trim();
    const content = document.getElementById('noticeContent').value.trim();
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
        alert("Only Admins and Teachers can add notices!");
        return;
    }

    let notices = load('notices');

    if (!title || !content) {
        alert("Please fill all fields.");
        return;
    }

    notices.push({ title, content, addedBy: user.role });
    save('notices', notices);

    // Refresh notices board
    displayNotices();
    
    // Clear input fields
    document.getElementById('noticeTitle').value = "";
    document.getElementById('noticeContent').value = "";
}


// function displayNotices() {
//     const board = document.getElementById('noticeBoard');
//     const noticeSelect = document.getElementById('noticeSelect');

//     if (!board || !noticeSelect) {
//         console.error("Error: Elements not found!");
//         return;
//     }

//     let notices = load('notices');

//     // Update the dropdown list
//     noticeSelect.innerHTML = '<option value="">Select a Notice</option>';
//     notices.forEach((n, index) => {
//         let option = document.createElement('option');
//         option.value = index;
//         option.textContent = n.title;
//         noticeSelect.appendChild(option);
//     });

//     // Update the displayed notices
//     board.innerHTML = notices.length === 0 ? "<p>No notices available.</p>" : 
//         notices.map((n, index) => `
//             <div class="notice-box">
//                 <h3>${n.title}</h3>
//                 <p>${n.content}</p>
//                 <small>Added by: ${n.addedBy}</small>
//             </div>
//         `).join('');
// }
function displayNotices() {
    const board = document.getElementById('noticeBoard');
    const noticeSelect = document.getElementById('noticeSelect');

    if (!board || !noticeSelect) {
        console.error("Error: Elements not found!");
        return;
    }

    let notices = load('notices');

    // Clear dropdown and add a default option
    noticeSelect.innerHTML = '<option value="">Select a Notice</option>';
    
    notices.forEach((n, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.textContent = n.title;
        noticeSelect.appendChild(option);
    });

    board.innerHTML = notices.length === 0 ? "<p>No notices available.</p>" :
        notices.map(n => `
            <div class="notice-box">
                <h3>${n.title}</h3>
                <p>${n.content}</p>
                <small>Added by: ${n.addedBy}</small>
            </div>
        `).join('');
}


function loadSelectedNotice() {
    let notices = load('notices');
    let selectedIndex = document.getElementById('noticeSelect').value;

    if (selectedIndex !== "") {
        let selectedNotice = notices[parseInt(selectedIndex)];
        if (selectedNotice) {
            document.getElementById('noticeTitle').value = selectedNotice.title;
            document.getElementById('noticeContent').value = selectedNotice.content;
        }
    } else {
        document.getElementById('noticeTitle').value = "";
        document.getElementById('noticeContent').value = "";
    }
}



function editNotice() {
    let notices = load('notices');
    let selectedIndex = document.getElementById('noticeSelect').value;

    if (selectedIndex === "") {
        alert("Please select a notice to edit.");
        return;
    }

    let newTitle = document.getElementById('noticeTitle').value.trim();
    let newContent = document.getElementById('noticeContent').value.trim();

    if (newTitle && newContent) {
        notices[selectedIndex] = { title: newTitle, content: newContent, addedBy: notices[selectedIndex].addedBy };
        save('notices', notices);
        displayNotices();
        alert("Notice updated successfully!");
    } else {
        alert("Please fill all fields.");
    }
}


function deleteNotice() {
    let notices = load('notices');
    let selectedIndex = document.getElementById('noticeSelect').value;

    if (selectedIndex === "") {
        alert("Please select a notice to delete.");
        return;
    }

    notices.splice(selectedIndex, 1);
    save('notices', notices);
    displayNotices();
    alert("Notice deleted successfully!");
}

function showAddUser() {
    document.getElementById('addUserFields').style.display = "block";
    document.getElementById('resetPasswordFields').style.display = "none";
}
function showResetPassword() {
    document.getElementById('addUserFields').style.display = "none";
    document.getElementById('resetPasswordFields').style.display = "block";
}



// ===== USER MANAGEMENT =====
function addUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;
    
    if (!username || !password || !role) {
        alert("Please fill in all fields.");
        return;
    }

    let users = load("users");

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        alert("Username already exists!");
        return;
    }

    // Add new user to the list
    users.push({ username, password, role });
    save("users", users);

    alert(`User ${username} added successfully!`);

    // Clear input fields after adding a user
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    document.getElementById('role').value = "";
}




function resetPassword() {
    const username = document.getElementById('username').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    let users = load("users");

    if (!username || !newPassword) {
        alert("Please enter both username and new password.");
        return;
    }

    let user = users.find(user => user.username === username);

    if (!user) {
        alert("Username not found.");
        return;
    }

    user.password = newPassword;
    save("users", users);
    alert(`Password for ${username} reset successfully!`);
}
// Function to show the "New Password" field when resetting password
function showResetPassword() {
    document.getElementById('resetPasswordFields').style.display = "block";
}

// Function to confirm password reset
function confirmResetPassword() {
    const username = document.getElementById('username').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    let users = load("users"); // Assuming you have a function to get user data

    if (!username || !newPassword) {
        alert("Please enter both username and new password.");
        return;
    }

    let user = users.find(user => user.username === username);

    if (!user) {
        alert("Username not found.");
        return;
    }

    user.password = newPassword;
    save("users", users); // Save the updated password

    alert(`Password for ${username} has been reset successfully!`);

    // Hide the "New Password" field after reset
    document.getElementById('resetPasswordFields').style.display = "none";

    // Clear input fields
    document.getElementById('username').value = "";
    document.getElementById('newPassword').value = "";
}

function deleteUser() {
    const username = document.getElementById('username').value.trim();
    let users = load("users");

    if (!username) {
        alert("Please enter a username to delete.");
        return;
    }

    const index = users.findIndex(user => user.username === username);
    
    if (index === -1) {
        alert("Username not found.");
        return;
    }

    users.splice(index, 1);
    save("users", users);
    alert(`User ${username} deleted successfully!`);
}



document.addEventListener("DOMContentLoaded", function() {
    displayAnnouncements();
    displayNotices();
});

