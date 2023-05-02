import { observer } from 'mobx-react-lite';
import { SyntheticEvent, useState } from 'react';
import { Card, Header, Tab, Image, CardGroup, Grid, Button } from 'semantic-ui-react';
import ImageUploadWidget from '../../app/common/imageUpload/ImageUploadWidget';
import { Photo, Profile } from '../../app/models/Profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile;
}

const ProfilePhotos = ({ profile }: Props) => {
    const { profileStore: { isCurrentUser, uploadPhoto, uploading, loading, setMainPhoto, deletePhoto } } = useStore();
    const [AddPhotoMode, SetAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('')

    const handlePhotoUpload = (file: Blob) => {
        uploadPhoto(file).then(() => SetAddPhotoMode(false));
    }

    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photoes'></Header>
                    {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content={AddPhotoMode ? 'Cancel' : 'Add'}
                            onClick={() => SetAddPhotoMode(!AddPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {AddPhotoMode ? (
                        <ImageUploadWidget uploadImage={handlePhotoUpload} loading={uploading} />
                    ) : (
                        <CardGroup itemsPerRow={5}>
                            {profile.photos?.map(photo => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button
                                                basic
                                                color='green'
                                                content='Main'
                                                name={'mian' + photo.id}
                                                loading={target === 'mian' + photo.id && loading}
                                                disabled={photo.isMain}
                                                onClick={e => handleSetMainPhoto(photo, e)}
                                            />
                                            <Button
                                                icon='trash'
                                                color='red'
                                                basic
                                                name={'trash' + photo.id} 
                                                loading={target === 'trash' + photo.id && loading}
                                                onClick={e => handleDeletePhoto(photo, e)}
                                                disabled={photo.isMain}
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </CardGroup>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfilePhotos);