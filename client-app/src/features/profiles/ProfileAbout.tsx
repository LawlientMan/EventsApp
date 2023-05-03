import { Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Button, Form, Grid, Header, Tab } from 'semantic-ui-react'
import { Profile } from '../../app/models/Profile'
import { useStore } from '../../app/stores/store'
import * as Yup from 'yup';
import MyTextInput from '../../app/common/form/MyTextInput'
import MyTextAreaInput from '../../app/common/form/MyTextAreaInput'
import { loadavg } from 'os'

interface Props {
    profile: Profile
}

const ProfileAbout = ({ profile }: Props) => {
    var { profileStore: { isCurrentUser, updateProfile, loading } } = useStore();
    const [editMode, setEditMode] = useState(false);

    const validationSchima = Yup.object({
        displayName: Yup.string().required('The displayName is requered'),
    });

    const handleFormSubmit = (editProfile: Partial<Profile>) => {
        updateProfile(editProfile).then(() => setEditMode(false));
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={profile.displayName} />
                    {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content={editMode ? 'Cancel' : 'Edit'}
                            onClick={() => setEditMode(!editMode)}
                            disabled={loading}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {editMode ? (
                        <Formik
                            enableReinitialize
                            initialValues={{
                                displayName: profile.displayName,
                                bio: profile.bio,
                            }}
                            onSubmit={values => handleFormSubmit(values)}
                            validationSchema={validationSchima}
                        >
                            {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                    <MyTextInput name='displayName' placeholder='DisplayName' label='DisplayName' />
                                    <MyTextAreaInput name='bio' placeholder='Bio' rows={10} />
                                    <Button
                                        disabled={isSubmitting || !dirty || !isValid}
                                        loading={isSubmitting}
                                        floated='right'
                                        positive type='submit'
                                        content='Update Profile'
                                    />
                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <div style={{ whiteSpace: 'pre-line' }}>
                            {profile.bio}
                        </div>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfileAbout)