import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Header, Segment } from 'semantic-ui-react'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { ActivityFormValues } from '../../app/models/Activity'
import { useStore } from '../../app/stores/store'
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik'
import * as Yup from 'yup';
import MyTextInput from '../../app/common/form/MyTextInput'
import MyTextAreaInput from '../../app/common/form/MyTextAreaInput'
import MySelectInput from '../../app/common/form/MySelectInput'
import { categoryOptions } from '../../app/common/options/categoryOptions'
import MyDateInput from '../../app/common/form/MyDateInput'

const ActivityForm = () => {
  const { activityStore } = useStore();
  const { createActivity, editActivity, loadingInitial, loadActivity } = activityStore;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadActivity(id).then(act => setActivity(new ActivityFormValues(act)));
  }, [loadActivity, id]);

  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

  const validationSchima = Yup.object({
    title: Yup.string().required('The activity title is requered'),
    description: Yup.string().required('The activity description is requered'),
    category: Yup.string().required('The activity category is requered'),
    date: Yup.string().required('The activity date is requered'),
    city: Yup.string().required('The activity city is requered'),
    venue: Yup.string().required('The activity venue is requered')
  });

  function handleFormSubmit(activity: ActivityFormValues) {
    if (activity.id) {
      editActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    } else {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity).then(() => navigate(`/activities/${newActivity.id}`));
    }
  }

  if (loadingInitial) return <LoadingComponent content='Loading...' />

  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal' />
      <Formik
        enableReinitialize
        initialValues={activity}
        onSubmit={values => handleFormSubmit(values)}
        validationSchema={validationSchima}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
            <MyTextInput name='title' placeholder='Title' label='Title' />
            <MyTextAreaInput placeholder='Description' name='description' rows={3} />
            <MySelectInput placeholder='Category' name='category' options={categoryOptions} />
            <MyDateInput
              placeholderText='Date'
              name='date'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
            />
            <Header content='Location Details' sub color='teal' />
            <MyTextInput placeholder='City' name='city' />
            <MyTextInput placeholder='Venue' name='venue' />
            <Button
              disabled={ isSubmitting || !dirty || !isValid}
              loading={isSubmitting}
              floated='right'
              positive type='submit'
              content='Submit'
            />
            <Button as={Link} to='/activities' floated='right' type='submit' content='Cencel' />
          </Form>
        )}
      </Formik>
    </Segment>
  )
}

export default observer(ActivityForm);