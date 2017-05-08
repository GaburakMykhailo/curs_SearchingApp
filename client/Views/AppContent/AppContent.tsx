import * as React from 'react';
import {Redirect, Route, Switch} from "react-router";
import {inject, observer} from "mobx-react";
import {SocialStores} from "../../mobx/socials/SocialStores";
import {Users} from "../Users/Users";
import {SOCIALS, SOCIALS_ARRAY} from "../../constants/socials";
import {Button} from "react-bootstrap";
import {SearchEnum} from "../../constants/search";
import {Feeds} from "../Feeds/Feeds";
// import * as styles from './AppContent.css';

interface AppContentProps {
    socialStores?: SocialStores;
}

@inject('socialStores')
@observer
export class AppContent extends React.Component<AppContentProps, null> {

    public renderSearchMoreButton() {
        const {socialStores} = this.props;

        return (
            <div className={`text-center`}>
                {socialStores.isMore ? <Button onClick={() => socialStores.searchMore()} >Load More...</Button> : null}
            </div>);
    }

    public render() {
        const {socialStores} = this.props;

        return (
            <Switch>
                {socialStores.getSocialsByAllowedSearch(SearchEnum.users)
                    .map((item, i) => (
                        <Route
                            key={i}
                            path={`/${item.key}/${SearchEnum[SearchEnum.users]}`}>
                            <Users users={socialStores.users}>
                                {this.renderSearchMoreButton()}
                            </Users>
                        </Route>
                    ))}

                {socialStores.getSocialsByAllowedSearch(SearchEnum.feeds)
                    .map((item, i) => (
                        <Route
                            key={i}
                            path={`/${item.key}/${SearchEnum[SearchEnum.feeds]}`}>
                            <Feeds feeds={socialStores.feeds}>
                                {this.renderSearchMoreButton()}
                            </Feeds>
                        </Route>
                    ))}


                <Route render={() => <Redirect to={`/${SOCIALS.vkontakte}/users`}/>} />
            </Switch>
        );
    }
}