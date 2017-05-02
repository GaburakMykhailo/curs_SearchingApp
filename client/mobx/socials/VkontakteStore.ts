import {observable} from 'mobx';
import {User} from "../common/User";
import {debounce} from "../helpers/debounce";
import {lastCall} from "../helpers/lastCall";
import {ISocialStore} from "./ISocialStore";
import {SOCIALS} from "../../constants/socials";

export class VkontakteStore implements ISocialStore {
    private lastSearch = '';

    public logo = 'https://pp.userapi.com/c543104/v543104095/1783c/cOtdLh_Fw6w.jpg';

    @observable
    public logged: false;
    @observable
    public users: User[] = [];

    private parseUsers(data: any) {
        return data.response.items.map((item: any) => {
            const user = new User(item.first_name, item.last_name);
            user.userLink = `https://vk.com/${item.screen_name}`;
            user.photoLink = item.photo_200 || 'http://www.wellesleysocietyofartists.org/wp-content/uploads/2015/11/image-not-found.jpg';

            return user;
        });
    }

    private handleSearchUsers = (data: any) => {
        this.users = this.parseUsers(data);
    };

    private _searchUsers(userName: string, from = 0, count = 25) {
        return fetch(`api/vkontakte/users?` +
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
        this.lastSearch = userName;

        return this._searchUsers(userName);
    }

    searchUsersMore() {
        this._searchUsers(this.lastSearch, this.users.length)
            .then((data) => {
                this.users.push(...this.parseUsers(data));
            });
    }

    search(type: string, name: string): void {
        if (type === 'users') {
            this.searchUsers(name);
        }
    }

    public login(): void {
        if (!this.logged) {
            window.open(`api/${SOCIALS.vkontakte}/login`, '_blank');

            fetch(`api/${SOCIALS.vkontakte}/waitlogin`)
                .then((res) => res.json())
                .then((data: any) => {
                    this.logged = data.login;
                });
        }
    }
}