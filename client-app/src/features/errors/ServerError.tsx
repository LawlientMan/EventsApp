import { observer } from 'mobx-react-lite';
import React from 'react'
import { Container, Header, Segment, TextArea } from 'semantic-ui-react';
import { CommonServiceError } from '../../app/models/CommonServiceError';
import { useStore } from '../../app/stores/store'

const ServerError = () => {
    const { commonStore } = useStore();

    return (
        <Container>
            <Header as='h1'>Server Error</Header>
            <Header sub as='h5' color='red'>{commonStore.error?.message}</Header>
            {commonStore.error?.details && (
                <Segment>
                    <Header as='h4' content='Stack trace' color='teal' />
                    <code style={{ marginTop: 10 }}>{commonStore.error.details}</code>
                </Segment>
            )}
        </Container>
    )
}

export default observer(ServerError);