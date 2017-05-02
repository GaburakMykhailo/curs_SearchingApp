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

const routerStore = new RouterStore();
const vkontakteStore = new VkontakteStore();
const facebookStore = new FacebookStore();
const history = syncHistoryWithStore(createHistory(), routerStore);

const socialStores = new SocialStores({
    [SOCIALS.vkontakte]: vkontakteStore,
    [SOCIALS.facebook]: facebookStore,
}, routerStore.location.pathname.split('/')[1] || SOCIALS.vkontakte);

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
