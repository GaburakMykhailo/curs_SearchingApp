import {ISocialStore} from "./ISocialStore";
import {computed, observable} from "mobx";

export interface ISocialMap {
    [key: string]: ISocialStore
}

export interface SocialInstance {
    instance: ISocialStore,
    key: string;
}

export class SocialStores {
    private socials: ISocialMap;
    private socialsArray: SocialInstance[];

    @observable
    public activeSocialInstance: ISocialStore;
    @observable
    public activeSocial: string;

    constructor(socials: ISocialMap, activeSocial: string) {
        this.socials = socials;
        this.activeSocialInstance = this.socials[activeSocial];
        this.socialsArray = Object.keys(socials).map((key) => ({key, instance: socials[key]}));
        this.activeSocial = activeSocial;

        fetch('api/profile', {credentials: 'same-origin'})
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

    setActiveSocial(socialName: string) {
        this.activeSocialInstance = this.socials[socialName];
        this.activeSocial = socialName;

        this.activeSocialInstance.login();
    }

    getSocials() {
        return this.socialsArray;
    }

    getSocial(socialName: string) {
        return this.socials[socialName];
    }
}