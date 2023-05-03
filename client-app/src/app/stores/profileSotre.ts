import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/Profile";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile: boolean = false;
    uploading: boolean = false;
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isCurrentUser() {
        return store.userStore.user?.username &&
            store.userStore.user?.username === this.profile?.username;
    }

    loadProfile = async (username: string) => {
        runInAction(() => this.loadingProfile = true);
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        runInAction(() => this.uploading = true);
        try {
            var result = await agent.Profiles.uploadPhoto(file);
            var photo = result.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        runInAction(() => this.loading = true)
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(i => i.isMain)!.isMain = false;
                    this.profile.photos.find(i => i.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (photo: Photo) => {
        runInAction(() => this.loading = true)
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(i => i.id !== photo.id);
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        runInAction(() => this.loading = true)
        try {
            await agent.Profiles.editProfile(profile);
            runInAction(() => {
                if (profile.displayName &&
                    profile.displayName !== store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName);
                }

                this.profile = {...this.profile, ...profile as Profile};
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }
}