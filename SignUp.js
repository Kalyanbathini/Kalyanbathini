import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Message,
  Grid,
  Image,
  Header,
  Input,
  Placeholder,
} from 'semantic-ui-react';
import AuthenticationHash from '../utils/AuthenticationHash';
import registerImg from '../img/register.png';
import '../App.css';
import { VotingContext } from '../utils/Voter';

const SignUp = ({
  contract,
  account,
  accountCreated,
  web3,
  updateActiveItem,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    digicode: '',
    alertMessage: '',
    status: '',
    signedUp: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { candidateArray, getAllCandidateData, voterArray, getAllVoterData } =
    useContext(VotingContext);

  const onSignUp = async () => {
    const { username, password, digicode } = formData;

    if (username.trim() === '') {
      setFormData({
        ...formData,
        alertMessage: 'Please enter the username.',
        status: 'failed',
        password: '',
        digicode: '',
      });
      return;
    } else if (password.trim() === '') {
      setFormData({
        ...formData,
        alertMessage: 'Please enter the password.',
        status: 'failed',
        password: '',
        digicode: '',
      });
      return;
    } else if (digicode.trim() === '') {
      setFormData({
        ...formData,
        alertMessage: 'Please enter the 6 digit code.',
        status: 'failed',
        password: '',
        digicode: '',
      });
      return;
    }

    if (
      username.trim() !== '' &&
      password.trim() !== '' &&
      digicode.trim() !== ''
    ) {
      let usernameTrimmed = username.trim();
      let passwordTrimmed = password.trim();
      let digicodeTrimmed = digicode.trim();

      if (passwordTrimmed.length < 8) {
        setFormData({
          ...formData,
          alertMessage: 'At least 8 characters for password',
          status: 'failed',
          password: '',
          digicode: '',
        });
        return;
      } else if (digicodeTrimmed.length !== 6) {
        setFormData({
          ...formData,
          alertMessage: '6 digits required for digicode',
          status: 'failed',
          digicode: '',
        });
        return;
      } else {
        let userAddress = await contract.methods
          .getUserAddress()
          .call({ from: account });

        let candidateRegistered = false;
        let candidateName = '';

        candidateArray.forEach((candidate) => {
          if (candidate[5] === account) {
            candidateRegistered = true;
            candidateName = candidate[1];
          }
        });

        let voterRegistered = false;
        let voterName = '';

        voterArray.forEach((voter) => {
          if (voter[3] === account) {
            voterRegistered = true;
            voterName = voter[1];
          }
        });

        if (userAddress !== '0x0000000000000000000000000000000000000000') {
          setFormData({
            ...formData,
            alertMessage: 'This account already exists',
            status: 'failed',
            username: '',
            password: '',
            digicode: '',
          });
          return;
        } else if (
          !candidateRegistered &&
          !voterRegistered &&
          usernameTrimmed !== 'Admin'
        ) {
          setFormData({
            ...formData,
            alertMessage:
              'Please contact admin to register you as a candidate or voter.',
            status: 'failed',
            username: '',
            password: '',
            digicode: '',
          });
          return;
        }

        if (candidateRegistered) {
          if (usernameTrimmed !== candidateName) {
            setFormData({
              ...formData,
              alertMessage:
                'Please use same user name as you registered with admin.',
              status: 'failed',
              password: '',
              digicode: '',
            });
            return;
          }
        } else if (voterRegistered) {
          if (usernameTrimmed !== voterName) {
            setFormData({
              ...formData,
              alertMessage:
                'Please use same user name as you registered with admin.',
              status: 'failed',
              password: '',
              digicode: '',
            });
            return;
          }
        }

        let hash = await AuthenticationHash(
          usernameTrimmed,
          account,
          passwordTrimmed,
          digicodeTrimmed,
          web3
        );

        await contract.methods.register(hash).send({ from: account });

        setFormData({
          username: '',
          password: '',
          digicode: '',
          status: 'success',
          alertMessage: 'Signup successful',
          signedUp: true,
        });
      }
    }
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    accountCreated(formData.signedUp);
  }, [formData.signedUp, accountCreated]);

  const fetchData = async () => {
    try {
      await getAllCandidateData();
      await getAllVoterData();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    updateActiveItem('sign up', '#C5E898');
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='sign-up'>
      {loading ? (
        <Placeholder fluid>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      ) : (
        <Grid
          stackable
          columns={2}
          textAlign='left'>
          <Grid.Row>
            <Grid.Column width={6}>
              <Image
                src={registerImg}
                alt='image'
              />
            </Grid.Column>
            <Grid.Column width={1}></Grid.Column>
            <Grid.Column
              width={9}
              textAlign='center'>
              <Header
                style={{ fontWeight: 'bold', fontSize: 40, color: '#C5E898' }}>
                Create an account
              </Header>
              <div className='signup-form'>
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
                      <Form.Field required>
                        <input
                          type='text'
                          placeholder='Username'
                          value={formData.username}
                          autoComplete='username'
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              username: e.target.value,
                            })
                          }
                        />
                      </Form.Field>
                      <Form.Field required>
                        <Input
                          type={passwordVisible ? 'text' : 'password'}
                          placeholder='Password'
                          value={formData.password}
                          autoComplete='current-password'
                          onChange={(e, { value }) =>
                            setFormData({ ...formData, password: value })
                          }
                          action={
                            <Button
                              icon={passwordVisible ? 'eye slash' : 'eye'}
                              onClick={handlePasswordVisibility}
                            />
                          }
                        />
                      </Form.Field>
                      <Form.Field required>
                        <input
                          type='text'
                          placeholder='6 digit code'
                          value={formData.digicode}
                          autoComplete='digicode'
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              digicode: e.target.value,
                            })
                          }
                        />
                      </Form.Field>
                      <Form.Field>
                        <Button
                          type='submit'
                          primary
                          fluid
                          size='large'
                          onClick={onSignUp}>
                          Create account
                        </Button>
                      </Form.Field>
                    </Form>
                  </Card.Content>
                </Card>
                <div className='signin-onUp'>
                  Already have an account?{' '}
                  <Link
                    to='/sign-in'
                    style={{ color: '#C5E898' }}
                    onClick={() => updateActiveItem('sign in', '#C5E898')}>
                    Sign in
                  </Link>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </div>
  );
};

export default SignUp;
