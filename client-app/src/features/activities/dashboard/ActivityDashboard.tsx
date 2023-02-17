import React from 'react'
import { Grid } from 'semantic-ui-react'
import { Activity } from '../../../app/models/Activity';
import ActivityForm from '../../form/ActivityForm';
import ActivityDetails from '../details/ActivityDetails';
import ActivityList from './ActivityList';

interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined,
    selectActivity: (id: string) => void,
    deleteActivity: (id: string) => void,
    cancelSelectActivity: () => void,
    editMode: boolean,
    openForm: (id:string) =>void,
    closeForm: () => void,
    createOrEditActivity: (activity:Activity) => void,
    submitting: boolean
}

const ActivityDashboard = ({ activities, selectedActivity,
    selectActivity,deleteActivity, cancelSelectActivity, editMode, openForm, closeForm , createOrEditActivity,
    submitting}: Props) => {

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList 
                    activities={activities} 
                    selectActivity={selectActivity}
                    deleteActivity= {deleteActivity} 
                    submitting={submitting}
                />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode
                    && <ActivityDetails
                        activity={selectedActivity}
                        cancelSelectActivity={cancelSelectActivity}
                        openForm={openForm}
                    />
                }
                {editMode &&
                    <ActivityForm 
                        closeForm={closeForm} activity={selectedActivity}
                        createOrEditActivity={createOrEditActivity}
                        submitting = {submitting}
                    />
                }
            </Grid.Column>
        </Grid>
    )
}

export default ActivityDashboard