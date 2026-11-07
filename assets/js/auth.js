/**
 * New Fashion - Authentication Module
 * Handles Customer / Admin login, registration, and session storage.
 */

const Auth = (function() {
    const SESSION_KEY = 'newfashion_session_user';

    function getCurrentUser() {
        const userJson = localStorage.getItem(SESSION_KEY);
        if (!userJson) return null;
        try {
            const parsed = JSON.parse(userJson);
            // Re-fetch latest from DB in case details changed
            return DB.getUserById(parsed.user_id) || parsed;
        } catch (e) {
            return null;
        }
    }

    function setCurrentUser(user) {
        if (!user) {
            localStorage.removeItem(SESSION_KEY);
        } else {
            localStorage.setItem(SESSION_KEY, JSON.stringify({
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }));
        }
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: user }));
    }

    function login(email, password) {
        const user = DB.getUserByEmail(email);
        if (!user) {
            return { success: false, message: 'No account found with this email.' };
        }
        if (user.password !== password) {
            return { success: false, message: 'Invalid password. Try again.' };
        }
        setCurrentUser(user);
        return { success: true, user };
    }

    function register(data) {
        const existing = DB.getUserByEmail(data.email);
        if (existing) {
            return { success: false, message: 'An account with this email already exists.' };
        }
        if (!data.name || !data.email || !data.password) {
            return { success: false, message: 'Please complete all required fields.' };
        }
        const newUser = DB.createUser({
            name: data.name,
            email: data.email,
            password: data.password,
            role: 'Customer',
            phone: data.phone || '',
            address: data.address || ''
        });
        setCurrentUser(newUser);
        return { success: true, user: newUser };
    }

    function logout() {
        setCurrentUser(null);
    }

    function isAdmin() {
        const u = getCurrentUser();
        return u && u.role === 'Admin';
    }

    return {
        getCurrentUser,
        setCurrentUser,
        login,
        register,
        logout,
        isAdmin
    };
})();
