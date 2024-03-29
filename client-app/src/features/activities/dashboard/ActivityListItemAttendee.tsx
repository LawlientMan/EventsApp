import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom';
import { List, Image, Popup } from 'semantic-ui-react'
import { Profile } from '../../../app/models/Profile'
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
  attendees: Profile[];
}

const ActivityListItemAttendee = ({ attendees }: Props) => {
  const styles = {
    borderColor: 'orange',
    borderWidth: 3
  };

  return (
    <List horizontal>
      {attendees.map(a => (
        <Popup
          hoverable
          key={a.username}
          trigger={
            <List.Item key={a.username} as={Link} to={`/profiles/${a.username}`}>
              <Image 
                size='mini' 
                circular
                src={a.image || '/assets/user.png'} 
                bordered
                style={a.following ? styles : null}
              />
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={a}></ProfileCard>
          </Popup.Content>
        </Popup>
      ))}
    </List>
  )
}

export default observer(ActivityListItemAttendee)