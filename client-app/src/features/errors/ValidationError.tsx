import React from 'react'
import { Message } from 'semantic-ui-react'

interface Props {
    errors: any
}

const ValidationError = ({ errors }: Props) => {
    return (
        <Message error>
            {errors && (
                <Message.List>
                    {errors.map((error: string, i: any) => (
                        <Message.Item key={i}>
                            {error}
                        </Message.Item>
                    ))}
                </Message.List>
            )
            }
        </Message>
    )
}

export default ValidationError