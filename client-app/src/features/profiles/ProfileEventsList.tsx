import { Card, Grid, Tab, Icon, Image } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ProfileEventsList = () => {
    const { profileStore } = useStore();
    const { userActivities, loadingActivities } = profileStore;

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {userActivities.map(activity => (
                            <Card as={Link} to={`/activities/${activity.id}`} key={activity.id}>
                                <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
                                <Card.Content>
                                    <Card.Header>{activity.title}</Card.Header>
                                    <Card.Description textAlign='center'>{format(activity.date!, 'dd MMM yyyy')}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfileEventsList)