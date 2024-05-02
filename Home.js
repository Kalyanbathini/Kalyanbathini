import React, { useContext, useEffect, useState } from 'react';
import {
  Grid,
  Image,
  Container,
  Header,
  Card,
  List,
  Item,
} from 'semantic-ui-react';
import communityImg from '../img/community.png';
import '../App.css';
import { VotingContext } from '../utils/Voter';

const Home = ({ updateActiveItem }) => {
  const {
    getAllCandidateData,
    candidateArray,
    getAllVoterData,
    getAllEventsData,
  } = useContext(VotingContext);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      await getAllCandidateData();
      await getAllVoterData();
      await getAllEventsData();
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    updateActiveItem('Student Community Platform', '#C5E898');
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='home-page'>
      <Grid
        stackable
        columns={2}
        textAlign='left'>
        <Grid.Row>
          <Grid.Column width={7}>
            {candidateArray.length > 0 && !loading ? (
              <Card
                fluid
                centered
                style={{ width: '80%', height: '100%', padding: 10 }}>
                <Header
                  as='h2'
                  style={{
                    paddingTop: 20,
                    color: '#29ADB2',
                    textAlign: 'center',
                  }}>
                  Candidate Ranking
                </Header>
                <Item.Group divided>
                  {candidateArray
                    .sort((a, b) => b[4] - a[4])
                    .slice(0, 4)
                    .map((el, i) => (
                      <Item
                        key={el[2]}
                        style={{ padding: 20, textAlign: 'left' }}>
                        <Item.Image
                          size='tiny'
                          src={el[3]}
                        />
                        <Item.Content>
                          <Item.Header as='h2'>
                            {i + 1}. {el[1]}
                          </Item.Header>
                          <Item.Description>Age: {el[0]}</Item.Description>
                          <Item.Extra>{el[4]} Votes</Item.Extra>
                        </Item.Content>
                      </Item>
                    ))}
                </Item.Group>
              </Card>
            ) : (
              <Image
                src={communityImg}
                alt='image'
              />
            )}
          </Grid.Column>
          <Grid.Column width={9}>
            <Card
              fluid
              style={{
                backgroundColor: '#F3F3F3',
                height: candidateArray.length > 0 && !loading ? '100%' : '95%',
              }}>
              <Card.Content>
                <Container fluid>
                  <Item.Group
                    divided
                    style={{ padding: 20 }}>
                    <Header
                      as='h1'
                      style={{
                        color: '#29ADB2',
                        textAlign: 'center',
                        paddingBottom: 16,
                        margin: 0,
                      }}>
                      Welcome To Student Community Platform
                    </Header>
                    <Item style={{ textAlign: 'left' }}>
                      <Item.Image
                        style={{ width: 200 }}
                        src='https://react.semantic-ui.com/images/avatar/large/rachel.png'
                      />

                      <Item.Content>
                        <Item.Header as='h2'>
                          How To Be A Candidate?
                        </Item.Header>
                        <Item.Description>
                          <List ordered>
                            <List.Item>
                              Request The Admin To Register As A Candidate.
                            </List.Item>
                            <List.Item>
                              Sign Up And Sign In Into The System.
                            </List.Item>
                            <List.Item>View Your Current Vote Count.</List.Item>
                          </List>
                        </Item.Description>
                      </Item.Content>
                    </Item>

                    <Item style={{ textAlign: 'left' }}>
                      <Item.Image
                        style={{ width: 200 }}
                        src='https://react.semantic-ui.com/images/avatar/large/kristy.png'
                      />

                      <Item.Content>
                        <Item.Header as='h2'>
                          How To Be A Voter / Student?
                        </Item.Header>
                        <Item.Description>
                          <List ordered>
                            <List.Item>
                              Request The Admin To Register As A Voter /
                              Student.
                            </List.Item>
                            <List.Item>
                              Sign Up And Sign In Into The System.
                            </List.Item>
                            <List.Item>
                              Vote For Your Favourite Candidate.
                            </List.Item>
                            <List.Item>
                              Add New Events To The Community.
                            </List.Item>
                          </List>
                        </Item.Description>
                      </Item.Content>
                    </Item>
                  </Item.Group>
                </Container>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Home;
