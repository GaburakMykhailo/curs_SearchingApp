import * as React from 'react';
import {Image, Tab, Tabs} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import {SocialStores} from "../../mobx/socials/SocialStores";

interface OptionsProps {
    socialStores?: SocialStores
}

@inject('socialStores')
@observer
export class Options extends React.Component<OptionsProps, null> {
    public static displayName = 'SearchOptions';

    public render() {

        return (
            <div>
                Options
            </div>
        );
    }
}