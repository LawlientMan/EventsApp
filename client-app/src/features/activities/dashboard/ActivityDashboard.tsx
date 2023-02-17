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
    createOrEditActivity: (activity:Activity) => void
}

const ActivityDashboard = ({ activities, selectedActivity,
    selectActivity,deleteActivity, cancelSelectActivity, editMode, openForm, closeForm , createOrEditActivity}: Props) => {

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList 
                    activities={activities} 
                    selectActivity={selectActivity}
                    deleteActivity= {deleteActivity} 
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
                    />
                }
            </Grid.Column>
        </Grid>
    )
}

export default ActivityDashboard