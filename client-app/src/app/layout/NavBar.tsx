import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react'

const NavBar = () => {

  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header as={NavLink} to='/'>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: '10px' }} />
          Reactivities
        </Menu.Item>
        <Menu.Item name='Avtivities' as={NavLink} to='/activities'/>
        <Menu.Item name='Errors' as={NavLink} to='/errors'/>
        <Menu.Item>
          <Button positive as={NavLink} to='/createActivity' content='Create Activity'/>
        </Menu.Item>
      </Container>
    </Menu>
  )
}

export default observer(NavBar);