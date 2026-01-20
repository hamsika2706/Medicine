// State management
let state = {
    isAuthenticated: false,
    user: null,
    reminders: []
};

// DOM Elements
const loginContainer = document.getElementById('loginContainer');
const mainContainer = document.getElementById('mainContainer');
const loginForm = document.getElementById('loginForm');
const reminderForm = document.getElementById('reminderForm');
const reminderList = document.getElementById('reminderList');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
reminderForm.addEventListener('submit', handleAddReminder);
logoutBtn.addEventListener('click', handleLogout);

// Login Handler
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // In a real app, this would validate with a backend
    state.isAuthenticated = true;
    state.user = { email, password };

    updateUI();
    loginForm.reset();
}

// Logout Handler
function handleLogout() {
    state = {
        isAuthenticated: false,
        user: null,
        reminders: []
    };
    updateUI();
}

// Add Reminder Handler
async function handleAddReminder(e) {
    e.preventDefault();

    const reminder = {
        userEmail: state.user.email, // user email to associate with the reminder
        medicineName: document.getElementById('medicineName').value,
        time: document.getElementById('time').value,
        frequency: document.getElementById('frequency').value,
        notificationType: document.getElementById('notificationType').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        personPhoneNumber: document.getElementById('personPhoneNumber').value,
        numDays: document.getElementById('numDays').value
    };

    try {
        const res = await fetch("http://localhost:5000/reminders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reminder)
        });

        const data = await res.json();
        if (res.ok) {
            state.reminders.push(data.reminder);
            updateUI();
            reminderForm.reset();
        } else {
            alert("❌ Failed to save reminder: " + data.error);
            console.error("Backend error:", data.details);
        }
    } catch (err) {
        alert("⚠️ Network error while saving reminder.");
        console.error("Fetch error:", err);
    }
}

// Delete Reminder Handler
function handleDeleteReminder(id) {
    state.reminders = state.reminders.filter(reminder => reminder.id !== id);
    updateUI();
}

// UI Updates
function updateUI() {
    // Update visibility
    loginContainer.classList.toggle('hidden', state.isAuthenticated);
    mainContainer.classList.toggle('hidden', !state.isAuthenticated);

    if (state.isAuthenticated) {
        // Update user info
        userEmail.textContent = state.user.email;
        
        // Update reminder list
        reminderList.innerHTML = state.reminders.length === 0 
            ? '<p class="text-center text-gray-500">No reminders set yet.</p>'
            : state.reminders.map(reminder => `
                <div class="reminder-item">
                    <div class="reminder-info">
                        <h3>${reminder.medicineName}</h3>
                        <p>⏰ ${reminder.time} - ${reminder.frequency}</p>
                        <p>📞 Your Phone: ${reminder.phoneNumber}</p>
                        <p>📞 Person's Phone: ${reminder.personPhoneNumber}</p>
                        <p>📅 Set for ${reminder.numDays} days</p>
                    </div>
                    <button 
                        onclick="handleDeleteReminder('${reminder.id}')" 
                        class="delete-btn"
                        aria-label="Delete reminder"
                    >
                        🗑
                    </button>
                </div>
            `).join('');
    }
}

// Initial UI update
updateUI();
