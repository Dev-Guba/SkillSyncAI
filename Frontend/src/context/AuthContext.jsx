import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api.js";
import { STORAGE_KEYS } from "../utils/storageKeys.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);

        if (storedAuth) {
            try {
                const auth = JSON.parse(storedAuth);

                setUser(auth.user);
                setToken(auth.token);
            } catch {
                localStorage.removeItem(STORAGE_KEYS.AUTH);
            }
        }

        setLoading(false);
    }, []);

    const register = async (data) => {
        const response = await API.register(data);

        const auth = {
            token: response.data.token,
            user: response.data.user,
        };

        localStorage.setItem(
            STORAGE_KEYS.AUTH,
            JSON.stringify(auth)
        );

        setUser(auth.user);
        setToken(auth.token);

        return response;
    };

    const login = async (data) => {
        const response = await API.login(data);

        const auth = {
            token: response.data.token,
            user: response.data.user,
        };

        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));

        setToken(auth.token);

        const me = await API.getMe();

        setUser(me.data.user);

        localStorage.setItem(
            STORAGE_KEYS.AUTH,
            JSON.stringify({
                token: auth.token,
                user: me.data.user,
            })
        );

        return me.data;
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH);

        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                token,
                loading,
                register,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}