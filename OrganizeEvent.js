import React, { useState, useContext, useEffect } from 'react';
import {
  Form,
  Button,
  Card,
  Message,
  Grid,
  Image,
  Header,
} from 'semantic-ui-react';
import voterImg from '../img/voter.png';
import '../App.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import { VotingContext } from '../utils/Voter';

const OrganizeEvent = ({ account, updateActiveItem }) => {
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    date: '',
    alertMessage: '',
    status: '',
  });

  const [imageUrl, setImageUrl] = useState('');

  const { setEvent, getAllEventsData } = useContext(VotingContext);

  const handleOrganizeEvent = async (eventData) => {
    const { title, description, date } = eventData;

    if (imageUrl.trim() === '') {
      setFormData({
        ...formData,
        alertMessage: 'Please Select An Image!',
        status: 'failed',
      });
      return;
    } else if (title.trim() === '') {
      setFormData({
        ...formData,
        alertMessage: 'Please Enter The Title!',
        status: 'failed',
      });
      return;
    } else if (description.trim() === '') {
      setFormData({
        ...formData,
        alertMessage: 'Please Enter The Description!',
        status: 'failed',
      });
      return;
    } else if (date.trim() === '') {
      setFormData({
        ...formData,
        alertMessage: 'Please Enter The Date!',
        status: 'failed',
      });
      return;
    } else {
      setFormData({
        ...formData,
        alertMessage: 'Uploading Image...',
        status: 'success',
      });
      uploadImage().then(async (url) => {
        setFormData({
          ...formData,
          alertMessage: 'Image Uploaded Successfully!',
          status: 'success',
        });

        if (
          url.trim() !== '' &&
          title.trim() !== '' &&
          description.trim() !== '' &&
          date.trim() !== ''
        ) {
          console.log({
            ...formData,
            imageUrl: url,
          });
          const success = await setEvent({
            title: title,
            description: description,
            date: `${date}`,
            imageUrl: url,
          });
          if (success) {
            setFormData({
              alertMessage: 'An Event Is Successfully Organized!',
              status: 'success',
              image: '',
              title: '',
              description: '',
              date: '',
            });
            setImageUrl('');
            getAllEventsData();
          } else {
            setFormData({
              alertMessage: 'Failed To Organize An Event!',
              status: 'failed',
              image: '',
              title: '',
              description: '',
              date: '',
            });
            setImageUrl('');
          }
        }
      });
    }
  };

  const uploadImage = async () => {
    const CLOUD_NAME = 'ds3e7ydr8';
    const data = new FormData();

    data.append('file', formData.image);
    data.append('upload_preset', 'zfbyyyru');
    data.append('cloud_name', CLOUD_NAME);
    data.append('folder', 'StudentCommunityPlatform');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      );
      const res = await response.json();
      setImageUrl(res.secure_url);

      return res.secure_url;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updateActiveItem('organize event', '#C5E898');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='organize-event'>
      <Grid
        stackable
        columns={2}
        textAlign='left'
        padded>
        <Grid.Row>
          <Grid.Column width={5}>
            <Image
              src={voterImg}
              alt='image'
            />
          </Grid.Column>
          <Grid.Column
            width={11}
            textAlign='center'>
            <Header
              style={{
                fontWeight: 'bold',
                fontSize: 40,
                color: '#C5E898',
                margin: 0,
              }}>
              Organize Event
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
                                imageUrl === ''
                                  ? 'https://react.semantic-ui.com/images/wireframe/image.png'
                                  : imageUrl
                              }
                            />
                          </Form.Field>
                        </Grid.Column>
                        <Grid.Column width={10}>
                          <Form.Field required>
                            <Button
                              as='label'
                              htmlFor='file'
                              type='button'>
                              Upload An Image
                            </Button>
                            <input
                              required
                              type='file'
                              id='file'
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  image: e.target.files[0],
                                });

                                const reader = new FileReader();
                                reader.readAsDataURL(e.target.files[0]);

                                reader.onload = () => {
                                  setImageUrl(reader.result);
                                };
                              }}
                            />
                          </Form.Field>
                          <Form.Field required>
                            <input
                              minLength='3'
                              maxLength='40'
                              type='text'
                              placeholder='Title'
                              required
                              value={formData.title}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  title: e.target.value,
                                })
                              }
                            />
                          </Form.Field>
                          <Form.Field required>
                            <input
                              type='datetime-local'
                              placeholder='Date'
                              value={formData.date}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  date: e.target.value,
                                })
                              }
                              required
                            />
                          </Form.Field>
                          <Form.Field required>
                            <textarea
                              minLength='10'
                              maxLength='1000'
                              rows='5'
                              placeholder='Description'
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                              required
                            />
                          </Form.Field>
                          <Form.Field>
                            <Button
                              type='submit'
                              primary
                              fluid
                              size='large'
                              onClick={() => handleOrganizeEvent(formData)}>
                              Submit
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

export default OrganizeEvent;
