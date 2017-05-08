import {observable} from "mobx";

export class User {
    @observable public id?: string;
    @observable public userLink: string;
    @observable public photoLink?: string;

    @observable public firstName: string;
    @observable public lastName: string;
    @observable public surname?: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}