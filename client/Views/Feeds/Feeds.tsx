import * as React from 'react';
import {observer} from 'mobx-react';
import {User} from "../../mobx/common/User";
import {Grid, Row, Col, Image} from "react-bootstrap";
import * as styles from './Feeds.css';
import {Feed} from "../../mobx/common/Feed";

interface UsersComponentProps {
    feeds: Feed[];
}

@observer
export class Feeds extends React.Component<UsersComponentProps, null> {
    public static displayName = 'UsersComponent';

    public render() {
        const {feeds, children} = this.props;

        return (
            <div>
                {feeds.map((feed, i) => (
                    <FeedComponent key={i} feed={feed} />
                ))}
                {children}
            </div>
        );
    }
}

interface FeedComponentProps {
    feed: Feed;
}

@observer
export class FeedComponent extends React.Component<FeedComponentProps, null> {
    public static displayName = 'UserComponent';

    public render() {
        const {feed} = this.props;

        return (
            <a
                href={feed.postLink}
                target="_blank"
                className={styles.feed}
            >
                <Grid fluid >
                    <Row>
                        <Col xs={2}>
                            <Image responsive rounded src={feed.photoLink} />
                        </Col>

                        <Col xs={10}>
                            <p>{feed.text}</p>
                        </Col>
                    </Row>
                </Grid>
            </a>
        );
    }
}