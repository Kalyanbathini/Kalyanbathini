import React from 'react';
import { Card, Grid, Message, Image } from 'semantic-ui-react';
import '../App.css';

const UserAccount = ({ userType, account }) => {
  return (
    <div className='user-account'>
      <Grid centered stackable>
        <Grid.Row>
          <Grid.Column>
            <Card fluid>
              <Image
                src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                wrapped ui={false}
              />
              <Card.Content>
                <Card.Header>{userType}</Card.Header>
                <Card.Meta>
                  <span>user</span>
                </Card.Meta>
                <Card.Description>
                  <strong>
                    {
                      userType.charAt(0).toUpperCase() +
                      userType.toLowerCase().slice(1)
                    }
                  </strong> is a scientist and Blockchain developer living in Paris, France.
                  <br />
                  <a href='https://www.linkedin.com/in/samuel-ongala-edoumou/' target='_blank' rel='noopener noreferrer'>
                    LinkedIn Profile
                  </a>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Message size='mini'>
                  {account.toLowerCase()}
                </Message>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default UserAccount;
