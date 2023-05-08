import { observer } from 'mobx-react-lite'
import { SyntheticEvent } from 'react'
import { Profile } from '../../app/models/Profile'
import { useStore } from '../../app/stores/store'
import { Button, Reveal } from 'semantic-ui-react'

interface Props {
    profile: Profile
}

const FollowButton = ({ profile }: Props) => {
    const { profileStore: { updateFollowing, loading }, userStore } = useStore();

    if (profile.username === userStore.user?.username) return null;

    function handleFollowing(e: SyntheticEvent, username: string) {
        e.preventDefault();
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
    }

    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button 
                    fluid 
                    color='teal' 
                    content={profile.following ? 'Following' : 'Not following'} 
                />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button
                    fluid basic
                    color={profile.following ? 'red' : 'green'}
                    content={profile.following ? 'Unfollow' : 'Follow'}
                    loading={loading}
                    onClick={e=> handleFollowing(e, profile.username)}
                />
            </Reveal.Content>
        </Reveal>
    )
}

export default observer(FollowButton)