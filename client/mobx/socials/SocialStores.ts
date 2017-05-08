import {ICommonSocialStore, ISocialStores} from "./intefaces";
import {computed, observable} from "mobx";
import {User} from "../common/User";
import {lastCall} from "../helpers/lastCall";
import {debounce} from "../helpers/debounce";
import {SearchEnum} from "../../constants/search";
import fetchIntercept from 'fetch-intercept';
import {Feed} from "../common/Feed";
import {SOCIALS} from "../../constants/socials";

export interface ISocialMap {
    [key: string]: ICommonSocialStore
}

export interface SocialInstance {
    instance: ICommonSocialStore,
    key: string;
}

export class SocialStores implements ISocialStores {
    private socials: ISocialMap;
    private socialsArray: SocialInstance[];
    @observable public activeSocialInstance: ICommonSocialStore;
    @observable public activeSocial: string;

    public lastSearch: string;
    public isMore: boolean;
    @observable public type = SearchEnum.users;
    @observable public count: number;

    @observable public users: User[] = [];
    @observable public feeds: Feed[] = [];

    constructor(socials: ISocialMap, activeSocial =  SOCIALS.vkontakte, activeType = SearchEnum.users) {
        this.socials = socials;
        this.activeSocialInstance = this.socials[activeSocial];
        this.socialsArray = Object.keys(socials).map((key) => ({key, instance: socials[key]}));
        this.activeSocial = activeSocial;
        this.type = activeType;

        fetchIntercept.register({
            request: function (url: string, config: any) {
                // Modify the url or config here
                const newConfig = {
                    credentials: 'same-origin',
                    ...config,
                };

                return [url, newConfig];
            },

            requestError: function (error: Error) {
                // Called when an error occured during another 'request' interceptor call
                return Promise.reject(error);
            },

            response: function (response: any) {
                // Modify the reponse object
                return response;
            },

            responseError: function (error: Error) {
                // Handle an fetch error
                return Promise.reject(error);
            }
        });

        this.checkProfiles();
    }

    private checkProfiles() {
        fetch(`api/profile?t${new Date().valueOf()}`)
            .then(res => res.json())
            .then((data: any) => {
                Object.keys(data)
                    .forEach(key => {
                        if (this.socials[key]) {
                            this.socials[key].logged = data[key];
                        }
                    })
            })
    }

    private handleSearchUsers = ([data, instance, isMore]: [any, ICommonSocialStore, boolean]) => {
        const newUsers = instance.parseUsers(data);
        const users = (isMore ? this.users : []).concat(newUsers);
        this.count = users.length;
        this.isMore = !!newUsers.length;
        this.users = users;
    };

    @debounce(600)
    @lastCall('handleSearchUsers')
    public searchUsers(userName: string, from?: number, count?: number, isMore?: boolean) {
        return Promise.all([
            this.activeSocialInstance.searchUsers(userName, from, count),
            Promise.resolve(this.activeSocialInstance),
            Promise.resolve(isMore),
        ])
    }

    private handleSearchFeeds = ([data, instance, isMore]: [any, ICommonSocialStore, boolean]) => {
        const newFeeds = instance.parseFeeds(data);

        console.log(newFeeds);

        const feeds = (isMore ? this.feeds : []).concat(newFeeds);
        this.count = feeds.length;
        this.isMore = !!newFeeds.length;
        this.feeds = feeds;
    };


    @debounce(600)
    @lastCall('handleSearchFeeds')
    searchFeeds(search: string, from: number, count: number, isMore?: boolean): void | Promise<any> {
        return Promise.all([
            this.activeSocialInstance.searchFeeds(search, from, count),
            Promise.resolve(this.activeSocialInstance),
            Promise.resolve(isMore),
        ])
    }

    public search(name = '', from = 0, count = 25, isMore = false): void {
        this.lastSearch = name;
        name = name.replace(/#/g, '%23'); //issue with # in querystring

        switch (this.type) {
            case SearchEnum.users:
                this.searchUsers(name, from, count, isMore);
                break;
            case SearchEnum.feeds:
                this.searchFeeds(name, from, count, isMore);
                break;
            default:
                console.log(this.type);
                throw new Error('i don\'t know that type');
        }
    }

    public searchMore() {
        this.search(this.lastSearch, this.count, undefined, true);
    }

    public setActiveSocial(socialName: string) {
        if (!this.socials[socialName].allowedSearch.find((item) => item === this.type)) {
            this.setActiveType(SearchEnum.users);
        }


        this.activeSocialInstance = this.socials[socialName];
        this.activeSocial = socialName;

        this.login();
    }

    public login() {
        if (!this.activeSocialInstance.logged) {
            const win = this.activeSocialInstance.login();

            const interval = setInterval(() => {
                if (win.closed) {
                    clearInterval(interval);
                    this.checkProfiles();
                    this.search(this.lastSearch);
                }
            }, 1000);

        } else {
            this.search(this.lastSearch);
        }

    }

    public setActiveType(type: SearchEnum) {
        this.type = type;
        this.search(this.lastSearch);
    }

    public getSocials() {
        return this.socialsArray;
    }

    public getSocialsByAllowedSearch(searchKey: SearchEnum) {
        return this.socialsArray
            .filter((item) => item.instance.allowedSearch.find((num) => num === searchKey) != null);
    }

    public getSocial(socialName: string) {
        return this.socials[socialName];
    }
}