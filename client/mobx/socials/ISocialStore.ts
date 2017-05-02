import {User} from "../common/User";

export interface ISocialStore {
    logo: string;
    logged: boolean;

    users: User[];

    search(type: string, name: string): void;
    searchUsers(userName: string, from: number, count: number): void | Promise<any>;
    searchUsersMore(): void | Promise<any>;

    login(): void;
}