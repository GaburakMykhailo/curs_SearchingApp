import {observable} from 'mobx';
import {User} from "../common/User";
import {debounce} from "../helpers/debounce";
import {lastCall} from "../helpers/lastCall";
import {ISocialStore} from "./ISocialStore";
import {SOCIALS} from "../../constants/socials";

export class FacebookStore implements ISocialStore {
    private lastSearch = '';

    public logo = 'https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png';

    @observable
    public logged: false;
    @observable
    public usersCount: string;
    @observable
    public users: User[] = [];

    private parseUsers(data: any) {
        return data.data.map((item: any) => {
            const user = new User(item.name, '');
            user.userLink = `https://${SOCIALS.facebook}.com/${item.id}`;
            user.id = item.id;

            fetch(`api/${SOCIALS.facebook}/user-picture?` +
                `id=${user.id}`
                , {credentials: 'same-origin'})
                .then((res) => res.json())
                .then((data: any) => {
                    user.photoLink = data.data.url;
                });

            return user;
        });
    }

    private handleSearchUsers = (data: any) => {
        console.log('hello', data);

        this.users = this.parseUsers(data);

    };

    private _searchUsers(userName: string, from = 0, count = 25) {
        this.lastSearch = userName;

        return fetch(`api/${SOCIALS.facebook}/users?` +
            `name=${userName}` +
            `&from=${from}` +
            `&count=${count}`,
            {credentials: 'same-origin'})
            .then((data) => data.json())
            .catch(() => this.logged = false);
    }

    @debounce(600)
    @lastCall('handleSearchUsers')
    public searchUsers(userName: string, from?: number, count?: number) {
        // return fetch('api/profile');
        return this._searchUsers(userName);
    }

    searchUsersMore() {
        return this._searchUsers(this.lastSearch, this.users.length)
            .then((data: any) => {
                this.users.push(...this.parseUsers(data));
            })
    }

    search(type: string, name: string): void {
        if (type === 'users') {
            this.searchUsers(name);
        }
    }

    public login(): void {
        if (!this.logged) {
            window.open(`api/${SOCIALS.facebook}/login`, '_blank');

            fetch(`api/${SOCIALS.facebook}/waitlogin`)
                .then((res) => res.json())
                .then((data: any) => {
                    this.logged = data.login;
                });
        }
    }
}