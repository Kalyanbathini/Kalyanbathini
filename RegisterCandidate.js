import React, { useState, useContext, useEffect } from 'react';
import {
  Form,
  Button,
  Card,
  Message,
  Grid,
  Image,
  Header,
  Dropdown,
} from 'semantic-ui-react';
import candidateImg from '../img/candidate.png';
import '../App.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import { VotingContext } from '../utils/Voter';

const RegisterCandidate = ({ updateActiveItem }) => {
  const [formData, setFormData] = useState({
    avatar: '',
    name: '',
    address: '',
    age: '',
    alertMessage: '',
    status: '',
  });

  const { setCandidate, getAllCandidateData } = useContext(VotingContext);

  const avatars = [
    {
      key: 'jenny',
      text: 'Jenny',
      value: 'https://react.semantic-ui.com/images/avatar/large/jenny.jpg',
    },
    {
      key: 'elliot',
      text: 'Elliot',
      value: 'https://react.semantic-ui.com/images/avatar/large/elliot.jpg',
    },
    {
      key: 'stevie',
      text: 'Stevie',
      value: 'https://react.semantic-ui.com/images/avatar/large/stevie.jpg',
    },
    {
      key: 'christian',
      text: 'Christian',
      value: 'https://react.semantic-ui.com/images/avatar/large/christian.jpg',
    },
    {
      key: 'matt',
      text: 'Matt',
      value: 'https://react.semantic-ui.com/images/avatar/large/matt.jpg',
    },
    {
      key: 'justen',
      text: 'Justen',
      value: 'https://react.semantic-ui.com/images/avatar/large/justen.jpg',
    },
    {
      key: 'helen',
      text: 'Helen',
      value: 'https://react.semantic-ui.com/images/avatar/large/helen.jpg',
    },
    {
      key: 'daniel',
      text: 'Daniel',
      value: 'https://react.semantic-ui.com/images/avatar/large/daniel.jpg',
    },
    {
      key: 'veronika',
      text: 'Veronika',
      value: 'https://react.semantic-ui.com/images/avatar/large/veronika.jpg',
    },
  ];

  const handleSetCandidate = async (candidateData) => {
    const { avatar, name, address, age } = candidateData;

    if (avatar.trim() === '') {
      setFormData({
        ...formData,
        alertMessage: 'Please select an avatar.',
        status: 'failed',
      });
      return;
    } else if (name.trim() === '') {
      setFormData({
        ...formData,
        alertMessage: 'Please enter the name.',
        status: 'failed',
      });
      return;
    } else if (address.trim() === '') {
      setFormData({
        ...formData,
        alertMessage: 'Please enter the metamask account address.',
        status: 'failed',
      });
      return;
    } else if (age.trim() === '') {
      setFormData({
        ...formData,
        alertMessage: 'Please enter the age.',
        status: 'failed',
      });
      return;
    }

    if (avatar.trim() !== '' && name.trim() !== '' && address.trim() !== '') {
      const ethereumAddressPattern = /^0x[0-9a-fA-F]{40}$/;

      let addressTrimmed = address.trim();
      let ageTrimmed = age.trim();
      let ageNum = parseInt(ageTrimmed, 10);

      if (!ethereumAddressPattern.test(addressTrimmed)) {
        setFormData({
          ...formData,
          alertMessage: 'Please enter a valid metamask account address.',
          status: 'failed',
        });
        return;
      } else if (ageNum < 18 || ageNum > 100) {
        setFormData({
          ...formData,
          alertMessage: 'Please enter the age in between 18 and 100',
          status: 'failed',
        });
        return;
      }

      const success = await setCandidate(formData);
      if (success) {
        // Voter creation was successful, handle accordingly
        setFormData({
          alertMessage: 'A candidate is successfully registered',
          status: 'success',
          avatar: '',
          name: '',
          address: '',
          age: '',
        });
        getAllCandidateData();
      } else {
        // Voter creation failed, handle accordingly
        setFormData({
          alertMessage: 'Failed to register a candidate',
          status: 'failed',
          avatar: '',
          name: '',
          address: '',
          age: '',
        });
      }
    }
  };

  useEffect(() => {
    updateActiveItem('register candidate', '#C5E898');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='register-candidate'>
      <Grid
        stackable
        columns={2}
        textAlign='left'>
        <Grid.Row>
          <Grid.Column width={5}>
            <Image
              src={candidateImg}
              alt='image'
            />
          </Grid.Column>
          <Grid.Column
            width={11}
            textAlign='center'>
            <Header
              style={{ fontWeight: 'bold', fontSize: 40, color: '#C5E898' }}>
              Register a candidate
            </Header>
            <div className='register-candidate-form'>
              <Card
                fluid
                centered>
                <Card.Content>
                  <Form size='large'>
                    {formData.alertMessage !== '' &&
                    formData.status === 'failed' ? (
                      <Message negative>{formData.alertMessage}</Message>
                    ) : formData.alertMessage !== '' &&
                      formData.status === 'success' ? (
                      <Message positive>{formData.alertMessage}</Message>
                    ) : (
                      <></>
                    )}
                    <Grid
                      stackable
                      columns={2}
                      textAlign='left'>
                      <Grid.Row>
                        <Grid.Column width={6}>
                          <Form.Field required>
                            <Image
                              src={
                                formData.avatar === ''
                                  ? 'https://react.semantic-ui.com/images/wireframe/image.png'
                                  : formData.avatar
                              }
                              size='medium'
                            />
                          </Form.Field>
                        </Grid.Column>
                        <Grid.Column width={10}>
                          <Form.Field required>
                            <Dropdown
                              floating
                              selection
                              fluid
                              placeholder='Select Avatar'
                              value={formData.avatar}
                              options={avatars}
                              onChange={(e, { value }) =>
                                setFormData({ ...formData, avatar: value })
                              }></Dropdown>
                          </Form.Field>
                          <Form.Field required>
                            <input
                              type='text'
                              placeholder='Name'
                              value={formData.name}
                              autoComplete='name'
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                            />
                          </Form.Field>
                          <Form.Field required>
                            <input
                              type='text'
                              placeholder='Metamask Account Address'
                              value={formData.address}
                              autoComplete='address'
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  address: e.target.value,
                                })
                              }
                            />
                          </Form.Field>
                          <Form.Field required>
                            <input
                              type='number'
                              placeholder='Age'
                              value={formData.age}
                              autoComplete='age'
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  age: e.target.value,
                                });
                              }}
                            />
                          </Form.Field>
                          <Form.Field>
                            <Button
                              type='submit'
                              primary
                              fluid
                              size='large'
                              onClick={() => handleSetCandidate(formData)}>
                              Register Candidate
                            </Button>
                          </Form.Field>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Form>
                </Card.Content>
              </Card>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default RegisterCandidate;
