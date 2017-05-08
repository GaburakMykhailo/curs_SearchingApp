import * as React from 'react';
import {Tab, Tabs} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import {SocialStores} from "../../mobx/socials/SocialStores";
import {SearchEnum} from "../../constants/search";
import {RouterStore} from "mobx-react-router";
import {RouteComponentProps, withRouter} from "react-router";

interface OptionsProps {
    socialStores?: SocialStores;
    routerStore?: RouterStore;
}

@withRouter
@inject('socialStores', 'routerStore')
@observer
export class Options extends React.Component<RouteComponentProps<any> & OptionsProps, any> {
    public static displayName? = 'SearchOptions';

    public render() {
        const {socialStores, routerStore, location} = this.props;
        const social = location.pathname.split('/')[1];

        return (
            <Tabs
                id="options_tabs"
                activeKey={socialStores.type}
                onSelect={(key: SearchEnum | any) => {
                    socialStores.setActiveType(key);
                    routerStore.push(`/${social}/${SearchEnum[key]}`);
                }}
            >
                {socialStores.activeSocialInstance.allowedSearch
                    .map((key, index) => (
                        <Tab
                            key={index}
                            eventKey={key}
                            title={SearchEnum[key]}
                        />
                    ))}
            </Tabs>
        );
    }
}