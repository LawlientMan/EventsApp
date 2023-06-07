import { observer } from 'mobx-react-lite'
import { Tab } from 'semantic-ui-react'
import { Profile } from '../../app/models/Profile';
import ProfileAbout from './ProfileAbout';
import ProfilePhotos from './ProfilePhotos';
import ProfileFollowings from './ProfileFollowings';
import { useStore } from '../../app/stores/store';
import ProfileEvents from './ProfileEvents';

interface Props {
    profile: Profile;
}

const ProfileContent = ({ profile }: Props) => {
    const {profileStore} = useStore();

    const panes = [
        { menuItem: 'About', render: () => <ProfileAbout profile={profile} /> },
        { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} /> },
        { menuItem: 'Events', render: () => <ProfileEvents /> },
        { menuItem: 'Followers', render: () => <ProfileFollowings /> },
        { menuItem: 'Following', render: () => <ProfileFollowings /> }
    ];

    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => profileStore.setActiveTab(data?.activeIndex)}
        />
    )
}

export default observer(ProfileContent)