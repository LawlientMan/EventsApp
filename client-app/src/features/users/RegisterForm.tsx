import { ErrorMessage, Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import { Button, Header } from 'semantic-ui-react'
import MyTextInput from '../../app/common/form/MyTextInput'
import { useStore } from '../../app/stores/store'
import * as Yup from 'yup'
import ValidationError from '../errors/ValidationError'

const RegisterForm = () => {
    const { userStore } = useStore();

    return (
        <Formik
            initialValues={{ email: '', password: '', displayName: '', username:'', error: null }}
            onSubmit={(values, { setErrors }) => userStore.register(values).catch(error => 
                setErrors({error: error}))}
                validationSchema={Yup.object({
                    displayName: Yup.string().required(),
                    username: Yup.string().required(),
                    email: Yup.string().required(),
                    password: Yup.string().required(),
                    passwordConfirmation: Yup.string().required().oneOf([Yup.ref('password')], 'Passwords must match')
                })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty}) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Sign up to Reactivities' color='teal' textAlign='center'/>
                    <MyTextInput name='email' placeholder='Email' />
                    <MyTextInput name='username' placeholder='Username' />
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <MyTextInput name='password' placeholder='Password' type='password' />
                    <MyTextInput name='passwordConfirmation' placeholder='Repeat Password' type='password' />
                    <ErrorMessage 
                        name='error'
                        render={()=> <ValidationError errors={errors.error}/>}
                    />
                    <Button loading={isSubmitting} positive content='Register' type='submit' fluid 
                        disabled={!isValid || !dirty || isSubmitting}
                    />
                </Form>
            )}
        </Formik>
    )
}

export default observer(RegisterForm);