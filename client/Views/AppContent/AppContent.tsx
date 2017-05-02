import * as React from 'react';
import {Redirect, Route, Switch} from "react-router";
import {inject, observer} from "mobx-react";
import {SocialStores} from "../../mobx/socials/SocialStores";
import {Users} from "../Users/Users";
import {SOCIALS} from "../../constants/socials";
// import * as styles from './AppContent.css';

interface AppContentProps {
    socialStores?: SocialStores;
}

@inject('socialStores')
@observer
export class AppContent extends React.Component<AppContentProps, null> {

    public render() {
        const {socialStores} = this.props;

        return (
            <Switch>
                <Route path={`/${SOCIALS.vkontakte}/users`}>
                    <Users users={socialStores.getSocial(SOCIALS.vkontakte).users} socialStore={socialStores.getSocial(SOCIALS.vkontakte)}/>
                </Route>

                <Route path={`/${SOCIALS.facebook}/users`}>
                    <Users users={socialStores.getSocial(SOCIALS.facebook).users}  socialStore={socialStores.getSocial(SOCIALS.facebook)}/>
                </Route>

                <Route render={() => <Redirect to={`/${SOCIALS.vkontakte}/users`}/>} />
            </Switch>
        );
    }
}