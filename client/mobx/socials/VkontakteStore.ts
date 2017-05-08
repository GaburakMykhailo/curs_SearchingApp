import {observable} from 'mobx';
import {User} from "../common/User";
import {debounce} from "../helpers/debounce";
import {lastCall} from "../helpers/lastCall";
import {ICommonSocialStore, ISocialStores} from "./intefaces";
import {SOCIALS} from "../../constants/socials";
import {SearchEnum} from "../../constants/search";
import {Feed} from "../common/Feed";

export class VkontakteStore implements ICommonSocialStore {
    public logo = 'https://pp.userapi.com/c543104/v543104095/1783c/cOtdLh_Fw6w.jpg';
    allowedSearch: SearchEnum[] = [SearchEnum.users, SearchEnum.feeds];
    @observable public logged: false;

    public parseUsers(data: any) {
        return data.response.items.map((item: any) => {
            const user = new User(item.first_name, item.last_name);
            user.userLink = `https://vk.com/${item.screen_name}`;
            user.photoLink = item.photo_200 || 'http://www.wellesleysocietyofartists.org/wp-content/uploads/2015/11/image-not-found.jpg';

            return user;
        });
    }

    public searchUsers(userName: string, from: number, count: number) {
        return fetch(`api/vkontakte/users?` +
            `name=${userName}` +
            `&from=${from}` +
            `&count=${count}`
        )
            .then((data) => data.json())
            .catch(() => this.logged = false);
    }


    public parseFeeds(data: any): Feed[] {
        return data.response.items.map((item: any) => {
            const feed = new Feed();
            feed.id = item.id;
            feed.text = item.text;
            item.attachments.some((attach: any) => {
                if (attach.type === 'photo') {
                    feed.photoLink = attach.photo.photo_604;

                    return true
                }

                return false;
            });

            const ownerId = item.owner_id;
            const normOwnerId = ownerId >= 0 ? ownerId : ~ownerId + 1;

            feed.postLink = `https://vk.com/${ownerId >= 0 ? 'id' : 'public'}${normOwnerId}?w=wall${ownerId}_${item.id}`;

            return feed;
        });
    }

    public searchFeeds(search: string, from: number, count: number): void | Promise<any> {
        return fetch(`api/vkontakte/feeds?` +
            `name=${search}` +
            `&from=${from}` +
            `&count=${count}`
        )
            .then((data) => data.json())
            .catch(() => this.logged = false);
    }

    public login(): Window {
        return window.open(`api/${SOCIALS.vkontakte}/login`, '_blank');
    }
}