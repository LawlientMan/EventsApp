import { makeAutoObservable, reaction } from "mobx";
import { CommonServiceError } from "../models/CommonServiceError";

export default class CommonStore {
    error: CommonServiceError | null = null;
    token: string | null = localStorage.getItem('jwt');
    appLoaded: boolean = false;

    constructor() {
        makeAutoObservable(this);
        reaction(
            ()=> this.token, 
            token => {
                if(token){
                    localStorage.setItem('jwt', token);
                } else {
                    localStorage.removeItem('jwt')
                }
            }
        );
    }

    setError = (error: CommonServiceError) => {
        this.error = error;
    }

    setToken = (token: string|null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}