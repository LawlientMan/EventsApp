import React, { useEffect } from 'react'
import { Grid, Header, Tab } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ProfileEventsList from './ProfileEventsList';

const ProfileEvents = () => {
    const { profileStore } = useStore();
    const { loadActivities } = profileStore;

    const panes = [
        { menuItem: 'Future events', render: () => <ProfileEventsList /> },
        { menuItem: 'Past events', render: () => <ProfileEventsList /> },
        { menuItem: 'Hosting', render: () => <ProfileEventsList /> }
    ];

    useEffect(() => {
        loadUserActivities(0);
    }, [])


    const loadUserActivities = (index: any) => {
        let predicate = 'future';
        if (index === 1) predicate = 'past';
        if (index === 2) predicate = 'hosting';

        loadActivities(predicate);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar alternate' content='Activities' />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab panes={panes}
                        menu={{ secondary: true, pointing: true }}
                        onTabChange={(e, data) => loadUserActivities(data?.activeIndex)}
                    />
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfileEvents)