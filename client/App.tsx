import React from 'react';
import { Provider } from 'mobx-react';
import { syncHistoryWithStore, RouterStore } from 'mobx-react-router';
import createHistory from 'history/createHashHistory';
import { Router } from 'react-router-dom';
import './global.css'
import AppLayout from './views/AppLayout';

import {VkontakteStore} from "./mobx/socials/VkontakteStore";
import {SocialStores} from "./mobx/socials/SocialStores";
import {SOCIALS} from "./constants/socials";
import {FacebookStore} from "./mobx/socials/FacebookStore";
import {SearchEnum} from "./constants/search";

const routerStore = new RouterStore();
const vkontakteStore = new VkontakteStore();
const facebookStore = new FacebookStore();
const history = syncHistoryWithStore(createHistory(), routerStore);

const pathArray = routerStore.location.pathname.split('/');
const social = pathArray[1] || undefined;
const type = pathArray[2];

// console.log(pathArray, social, SearchEnum[type]);

const socialStores = new SocialStores({
    [SOCIALS.vkontakte]: vkontakteStore,
    [SOCIALS.facebook]: facebookStore,
}, social, SearchEnum[type as any] as any);

const store = {
    routerStore,
    socialStores,
};

const App: React.StatelessComponent<null> = () => (
    <Router history={history}>
        <Provider {...store} >
            <AppLayout />
        </Provider>
    </Router>
);

App.displayName = 'App';

export default App;
