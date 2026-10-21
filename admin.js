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

    const isAdminLoggedIn = localStorage.getItem('ngl_admin_auth') === 'true';
    if (isAdminLoggedIn) {
        adminLoginSection.classList.add('hidden');
        adminDashboardSection.classList.remove('hidden');
        loadAdminStats();
    }

    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            const pass = adminPasswordInput.value.trim();
            if (pass === "jitu99") {
                localStorage.setItem('ngl_admin_auth', 'true');
                adminLoginSection.classList.add('hidden');
                adminDashboardSection.classList.remove('hidden');
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
            
            const usersSnapshot = await get(child(dbRef, 'users'));
            if (usersSnapshot.exists()) {
                const usersData = usersSnapshot.val();
                totalUsersCount.innerText = Object.keys(usersData).length;
            } else {
                totalUsersCount.innerText = "0";
            }

            const messagesSnapshot = await get(child(dbRef, 'messages'));
            if (messagesSnapshot.exists()) {
                const messagesData = messagesSnapshot.val();
                let totalMsgs = 0;
                Object.keys(messagesData).forEach(uid => {
                    if (messagesData[uid]) {
                        totalMsgs += Object.keys(messagesData[uid]).length;
                    }
                });
                totalMessagesCount.innerText = totalMsgs;
            } else {
                totalMessagesCount.innerText = "0";
            }

        } catch (error) {
            console.error("Error loading admin stats:", error);
            totalUsersCount.innerText = "Error";
            totalMessagesCount.innerText = "Error";
        }
    }
});
