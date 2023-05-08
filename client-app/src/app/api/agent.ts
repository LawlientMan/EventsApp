import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify';
import { Activity, ActivityFormValues } from '../models/Activity';
import { Photo, Profile } from '../models/Profile';
import { User, UserFormValues } from '../models/User';
import { router } from '../router/Routes';
import { store } from '../stores/store';

const sleep = (deley: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, deley);
    });
}

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if(token && config.headers){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors?.hasOwnProperty('id')) {
                router.navigate('/not-found');
            }
            if (data.errors) {
                const madalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        madalStateErrors.push(data.errors[key])
                    }
                }
                throw madalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 403:
            toast.error('forbiden');
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setError(JSON.parse(data));
            router.navigate('/server-error');
            break;
        default:
            break;
    }

    return Promise.reject(error);
});


axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('file', file);
        return axios.post<Photo>('photos', formData, {
            headers: {'Content-type': 'multipart/form-data'}
        });        
    },
    setMainPhoto: (id: string) => requests.post<void>(`photos/${id}/SetMain`, {}),
    deletePhoto: (id: string) => requests.del<void>(`photos/${id}`),
    editProfile: (profile: Partial<Profile>) => requests.put<void>('/profiles', profile),
    updateFollowing: (username: string) => requests.post<void>(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => 
        requests.get<Profile[]>(`follow/${username}?predicate=${predicate}`)
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;