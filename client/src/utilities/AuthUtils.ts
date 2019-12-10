import decode from "jwt-decode";
import axios from "axios";

interface IFetchOptions {
    method: string,
    body: string
}

export default class AuthUtils {
    private static tokenKey: string = "auth-token";

    static login = (username: string, password: string) => {
        return axios.post('/login', {
            username,
            password
        });
    }

    static register = (username: string, email: string, password: string, passwordRepeat: string) => {
        return axios.post('/register', {
            email,
            username,
            password,
            passwordRepeat
        });
    }

    static isLoggedIn = () => {
        const token = AuthUtils.getToken();
        return !!token && !AuthUtils.isTokenExpired(token);
    }

    static isTokenExpired = (token: string) => {
        try {
            const decodedToken = decode(token);
            return ((decodedToken as any).exp < Date.now() / 1000);
        } catch (err) {
            console.error("Token expired.");
            localStorage.removeItem(AuthUtils.tokenKey);
            return false;
        }
    }

    static getDecoded = () => {
        const token = AuthUtils.getToken();

        if (token === null) {
            console.log("Token is null.");
            return null;
        }

        return decode(token);
    }

    static setToken = (token: string) => {
        localStorage.setItem(AuthUtils.tokenKey, token);
    }

    static getToken = (): string | null => {
        return localStorage.getItem(AuthUtils.tokenKey);
    }

    static getUserType = (): number | null => {
        const userData: any = AuthUtils.getDecoded();

        if (userData) {
            return userData.userType
        }

        return null;
    }

    static logout = () => {
        localStorage.removeItem(AuthUtils.tokenKey);
    }

    static fetch = (route: string, options: IFetchOptions) => {
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": ""
        }

        if (AuthUtils.isLoggedIn()) {
            headers["Authorization"] = `Bearer ${AuthUtils.getToken()}`;
        }

        return fetch(route, {
            headers,
            ...options
        }).then(AuthUtils.checkStatus)
            .then((response) => response.json());
    }

    static checkStatus = (response: Response) => {
        if (response.status >= 200 || response.status < 300) {
            return response;
        } else {
            let error = new Error(response.statusText);
            (error as any).response = response;
            throw error;
        }
    }
}