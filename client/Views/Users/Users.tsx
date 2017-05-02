import * as React from 'react';
import {observer} from 'mobx-react';
import {User} from "../../mobx/common/User";
import {Jumbotron, Grid, Row, Col, Image, Button} from "react-bootstrap";
import * as styles from './Users.css';
import {ISocialStore} from "../../mobx/socials/ISocialStore";
import {withRouter} from "react-router";

interface UsersComponentProps {
    socialStore: ISocialStore;
    users: User[];
}

@observer
export class Users extends React.Component<UsersComponentProps, null> {
    public static displayName = 'UsersComponent';

    public render() {
        const {socialStore, users} = this.props;

        return (
            <div>
                {users.map((user, i) => (
                    <UserComponent key={i} user={user} />
                ))}
                <div className={`text-center ${styles.loadMore}`}>
                    {users.length ? <Button onClick={() => socialStore.searchUsersMore()} >Load More...</Button> : null}
                </div>
            </div>
        );
    }
}

interface UserComponentProps {
    user: User;
}

@observer
export class UserComponent extends React.Component<UserComponentProps, null> {
    public static displayName = 'UserComponent';

    public render() {
        const {user} = this.props;

        return (
            <a
                href={user.userLink}
                target="_blank"
                className={styles.user}
            >
                <Grid fluid >
                    <Row>
                        <Col xs={2}>
                            <Image responsive rounded src={user.photoLink} />
                        </Col>

                        <Col xs={10}>
                            <h4>{user.firstName} {user.lastName}</h4>
                        </Col>
                    </Row>
                </Grid>
            </a>
        );
    }
}