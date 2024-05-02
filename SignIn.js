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
import AuthValidation from '../utils/AuthValidation';
import loginImg from '../img/login.png';
import '../App.css';
import { VotingContext } from '../utils/Voter';

const SignIn = ({
  contract,
  account,
  web3,
  signedUp,
  userSignedIn,
  updateActiveItem,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    digicode: '',
    alertMessage: '',
    status: '',
    loggedIn: false,
  });

  const [userType, setUserType] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { candidateArray, getAllCandidateData, voterArray, getAllVoterData } =
    useContext(VotingContext);
  const [loading, setLoading] = useState(true);

  const onSignIn = async () => {
    const { username, password, digicode } = formData;

    if (username.trim() === '') {
      console.log(candidateArray);
      setFormData({
        alertMessage: 'Please enter the username.',
        status: 'failed',
        password: '',
        digicode: '',
      });
      return;
    } else if (password.trim() === '') {
      setFormData({
        alertMessage: 'Please enter the password.',
        status: 'failed',
        password: '',
        digicode: '',
      });
      return;
    } else if (digicode.trim() === '') {
      setFormData({
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
      if (password.length < 8) {
        setFormData({
          alertMessage: 'At least 8 characters for the password',
          status: 'failed',
          password: '',
          digicode: '',
        });
        return;
      } else if (digicode.length !== 6) {
        setFormData({
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
        // eslint-disable-next-line
        let candidateName = '';

        console.log(account);

        candidateArray.forEach((candidate) => {
          if (candidate[5] === account) {
            candidateRegistered = true;
            candidateName = candidate[1];
          }
          console.log(candidate);
        });

        let voterRegistered = false;
        // eslint-disable-next-line
        let voterName = '';

        voterArray.forEach((voter) => {
          if (voter[3] === account) {
            voterRegistered = true;
            voterName = voter[1];
          }
          console.log(voter);
        });

        console.log();

        if (userAddress === '0x0000000000000000000000000000000000000000') {
          setFormData({
            alertMessage: 'Please sign up an account to proceed',
            status: 'failed',
            username: '',
            password: '',
            digicode: '',
          });
          return;
        } else if (
          !candidateRegistered &&
          !voterRegistered &&
          username.trim() !== 'Admin'
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
        } else {
          let validated = await AuthValidation(
            username,
            account,
            password,
            digicode,
            web3,
            contract
          );

          if (!validated) {
            setFormData({
              alertMessage: 'Incorrect login',
              status: 'failed',
              username: '',
              password: '',
              digicode: '',
            });
            return;
          } else {
            // let candidateRegistered = false;

            // candidateArray.forEach(candidate => {
            //   if (candidate[5] === account) {
            //     candidateRegistered = true;
            //   }
            // });

            // let voterRegistered = false;

            // voterArray.forEach(voter => {
            //   if (voter[3] === account) {
            //     voterRegistered = true;
            //   }
            // });

            if (candidateRegistered) {
              setUserType('candidate');
            } else if (voterRegistered) {
              setUserType('voter');
            } else {
              setUserType('admin');
            }

            setFormData({
              username: '',
              password: '',
              digicode: '',
              status: 'success',
              alertMessage: 'Sign in successful',
              loggedIn: true,
            });
            return;
          }
        }
      }
    }
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

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
    updateActiveItem('sign in', '#C5E898');
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userType !== '') {
      userSignedIn(formData.loggedIn, userType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.loggedIn, userType]);

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
                src={loginImg}
                alt='image'
              />
            </Grid.Column>
            <Grid.Column width={1}></Grid.Column>
            <Grid.Column
              width={9}
              textAlign='center'>
              <Header
                style={{ fontWeight: 'bold', fontSize: 40, color: '#C5E898' }}>
                Sign in to your account
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
                          onClick={onSignIn}>
                          Sign in
                        </Button>
                      </Form.Field>
                    </Form>
                  </Card.Content>
                </Card>
                {signedUp ? (
                  console.log()
                ) : (
                  <div className='signin-onUp'>
                    Don't have an account?{' '}
                    <Link
                      to='/sign-up'
                      style={{ color: '#C5E898' }}
                      onClick={() => updateActiveItem('sign up', '#C5E898')}>
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </div>
  );
};

export default SignIn;
