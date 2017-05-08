import * as React from 'react';
import {FormControl, FormGroup, Image, Nav, Navbar, NavItem} from "react-bootstrap";
import {inject, observer} from "mobx-react";

import {SocialStores} from "../../mobx/socials/SocialStores";
import * as styles from './Navbar.css';
import {Route} from "react-router";
import {RouterStore} from "mobx-react-router";

interface NavbarComponentProps {
    socialStores?: SocialStores,
    routerStore?: RouterStore,
}

@inject('socialStores', 'routerStore')
@observer
export class NavbarComponent extends React.Component<NavbarComponentProps, null> {
    public static displayName = 'NavbarComponent';

    public render() {
        const {socialStores, routerStore} = this.props;

        return (
            <Navbar fluid>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a>Searching</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Navbar.Form pullLeft>
                    <FormGroup >
                        <FormControl
                            width="auto"
                            type="text"
                            placeholder="Search"
                            onChange={(event: any) => socialStores.search(event.target.value)}
                        />
                    </FormGroup>
                </Navbar.Form>

                <Nav pullRight>
                    {socialStores.getSocials()
                        .map((item, i) => (
                            <NavItem
                                key={i}
                                className={`${styles.socialItem}`
                                    + ` ${item.key === socialStores.activeSocial ? styles.socialItemCurrent : ''}`
                                    + ` ${item.instance.logged ? styles.socialItemActive : ''}`}
                                onClick={() => {
                                    socialStores.setActiveSocial(item.key);
                                    routerStore.push(`/${item.key}/users`)
                                }}
                            >
                                <Image src={item.instance.logo} width={20} rounded />
                            </NavItem>
                        ))}
                </Nav>
            </Navbar>
        );
    }
}