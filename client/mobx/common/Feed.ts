import {observable} from "mobx";

export class Feed {
    @observable public id?: string;
    @observable public postLink: string;
    @observable public photoLink: string;
    @observable public text: string;
}