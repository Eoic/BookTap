import decode from "jwt-decode";
import axios from "axios";

interface IFetchOptions {
    method: string,
    body: string
}

export default class AuthUtils {
    static login = (username: string, password: string) => {
        return AuthUtils.fetch('/login', {
            method: "POST",
            body: JSON.stringify({
                username, 
                password
            })
        }).then((response) => {
            if (typeof response.token !== "undefined")
                AuthUtils.setToken(response.token);

            return Promise.resolve(response);
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
        localStorage.setItem("auth-token", token);
    }

    static getToken = () : string | null => {
        return localStorage.getItem("auth-token");
    }

    static logout = () => {
        localStorage.removeItem("auth-token");
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