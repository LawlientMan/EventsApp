import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Card, Grid, Header, Tab } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store'
import ProfileCard from './ProfileCard'

const ProfileFollowings = () => {
    const { profileStore } = useStore();
    const { profile, followings, loadingFollowings, activeTab } = profileStore;

    return (
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width={16}>
                    <Header
                        floated='left'
                        icon='user'
                        content={activeTab === 3
                            ? `People following ${profile?.displayName}`
                            : `People ${profile?.displayName} is following`}
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {followings.map(p => (
                            <ProfileCard key={p.username} profile={p} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfileFollowings)