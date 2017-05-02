import React from 'react';
import * as styles from './App.css';

import {NavbarComponent} from './Navbar/Navbar';
import {Col, Grid, Row} from "react-bootstrap";
import {Options} from "./Options/Options";
import {AppContent} from "./AppContent/AppContent";

class AppLayout extends React.Component<null, null> {
    public static displayName = 'AppLayout';

    public render() {
        return (
            <div>
                <NavbarComponent/>

                <Grid fluid>
                    <Row >
                        {/*<Col sm={4} >*/}
                            {/*<Options/>*/}
                        {/*</Col>*/}

                        <Col sm ={12}>
                            <AppContent/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default AppLayout;
