import { makeAutoObservable } from "mobx";
import { CommonServiceError } from "../models/CommonServiceError";

export default class CommonStore {
    error: CommonServiceError | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setError = (error: CommonServiceError) => {
        this.error = error;
    }
}