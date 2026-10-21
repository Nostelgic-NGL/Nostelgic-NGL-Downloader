import { rtdb } from './firebase-config.js';
import { ref, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const adminLoginSection = document.getElementById('adminLoginSection');
    const adminDashboardSection = document.getElementById('adminDashboardSection');
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    
    const totalUsersCount = document.getElementById('totalUsersCount');
    const totalMessagesCount = document.getElementById('totalMessagesCount');

    // Check if already logged in
    const isAdminLoggedIn = localStorage.getItem('ngl_admin_auth') === 'true';
    if (isAdminLoggedIn) {
        if (adminLoginSection) adminLoginSection.classList.add('hidden');
        if (adminDashboardSection) adminDashboardSection.classList.remove('hidden');
        loadAdminStats();
    }

    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            const pass = adminPasswordInput.value.trim();
            // Password yahan 'jitu99' set hai
            if (pass === "jitu99") {
                localStorage.setItem('ngl_admin_auth', 'true');
                if (adminLoginSection) adminLoginSection.classList.add('hidden');
                if (adminDashboardSection) adminDashboardSection.classList.remove('hidden');
                loadAdminStats();
            } else {
                alert("Incorrect Admin Password!");
            }
        });
    }

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('ngl_admin_auth');
            window.location.reload();
        });
    }

    async function loadAdminStats() {
        try {
            const dbRef = ref(rtdb);
            
            // 1. Fetch Users Count safely
            try {
                const usersSnapshot = await get(child(dbRef, 'users'));
                if (usersSnapshot.exists()) {
                    const usersData = usersSnapshot.val();
                    totalUsersCount.innerText = usersData ? Object.keys(usersData).length : 0;
                } else {
                    totalUsersCount.innerText = "0";
                }
            } catch (err) {
                console.error("Users fetch error:", err);
                totalUsersCount.innerText = "0";
            }

            // 2. Fetch Messages Count safely
            try {
                const messagesSnapshot = await get(child(dbRef, 'messages'));
                if (messagesSnapshot.exists()) {
                    const messagesData = messagesSnapshot.val();
                    let totalMsgs = 0;
                    if (messagesData) {
                        Object.keys(messagesData).forEach(uid => {
                            if (messagesData[uid]) {
                                totalMsgs += Object.keys(messagesData[uid]).length;
                            }
                        });
                    }
                    totalMessagesCount.innerText = totalMsgs;
                } else {
                    totalMessagesCount.innerText = "0";
                }
            } catch (err) {
                console.error("Messages fetch error:", err);
                totalMessagesCount.innerText = "0";
            }

        } catch (error) {
            console.error("General error loading admin stats:", error);
            if (totalUsersCount) totalUsersCount.innerText = "Error";
            if (totalMessagesCount) totalMessagesCount.innerText = "Error";
        }
    }
});
