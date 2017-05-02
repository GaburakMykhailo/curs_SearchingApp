import {observable} from "mobx";

export class User {
    @observable
    public id?: string;
    @observable
    public firstName: string;
    @observable
    public lastName: string;
    @observable
    public surname?: string;
    @observable
    public photoLink?: string;
    @observable
    public userLink: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}