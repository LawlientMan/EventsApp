import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from '../../app/models/Profile';

interface Props{
    profile: Profile;
}

const ProfileCard = ({profile}: Props) => {
  return (
    <Card as={Link} to={`/profiles/${profile.username}`}>
        <Image src={profile.image || '/assets/user.png'} />
        <Card.Content>
            <Card.Header>{profile.displayName}</Card.Header>
            <Card.Header>Bio goes here</Card.Header>
        </Card.Content>
        <Card.Content extra>
            <Icon name='user'/>
            20 folowers
        </Card.Content>
    </Card>
  )
}

export default observer(ProfileCard);