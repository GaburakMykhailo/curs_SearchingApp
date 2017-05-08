import {User} from "../common/User";
import {SearchEnum} from "../../constants/search";
import {Feed} from "../common/Feed";

export interface ICommonSocialStore {
    allowedSearch: SearchEnum[];
    logo: string;
    logged: boolean;

    login(): Window;

    searchUsers?(userName: string, from: number, count: number): void | Promise<any>;
    parseUsers?(data: any): User[];

    searchFeeds?(search: string, from: number, count: number): void | Promise<any>;
    parseFeeds?(data: any): Feed[];
}


export interface ISocialStores {
    type: SearchEnum,

    users: User[];
    feeds: Feed[];

    searchUsers(userName: string, from: number, count: number, isMore?: boolean): void | Promise<any>;
    searchFeeds(search: string, from: number, count: number, isMore?: boolean): void | Promise<any>;

    search(name: string, from?: number, count?: number, isMore?: boolean): void;
    searchMore(): void;
}