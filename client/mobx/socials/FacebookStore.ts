import {observable} from 'mobx';
import {User} from "../common/User";
import {debounce} from "../helpers/debounce";
import {lastCall} from "../helpers/lastCall";
import {ICommonSocialStore, ISocialStores} from "./intefaces";
import {SOCIALS} from "../../constants/socials";
import {SearchEnum} from "../../constants/search";

export class FacebookStore implements ICommonSocialStore {
    public logo = 'https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png';
    allowedSearch: SearchEnum[] = [SearchEnum.users];
    @observable public logged: false;

    public parseUsers(data: any) {
        return data.data.map((item: any) => {
            const user = new User(item.name, '');
            user.userLink = `https://${SOCIALS.facebook}.com/${item.id}`;
            user.id = item.id;

            fetch(`api/${SOCIALS.facebook}/user-picture?` +
                `id=${user.id}`
            )
                .then((res) => res.json())
                .then((data: any) => {
                    user.photoLink = data.data.url;
                });

            return user;
        });
    }

    public searchUsers(userName: string, from: number, count: number) {
        return fetch(`api/${SOCIALS.facebook}/users?` +
            `name=${userName}` +
            `&from=${from}` +
            `&count=${count}`
        )
            .then((data) => data.json())
            .catch(() => this.logged = false);
    }

    public login(): Window {
        return window.open(`api/${SOCIALS.facebook}/login`, '_blank');
    }
}