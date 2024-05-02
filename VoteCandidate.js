import React, { useContext, useEffect, useState } from 'react';
import { VotingContext } from '../utils/Voter';
import {
  Button,
  Card,
  Grid,
  Header,
  Image,
  Placeholder,
} from 'semantic-ui-react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

const VoteCandidate = ({ account, updateActiveItem }) => {
  const {
    getAllCandidateData,
    candidateArray,
    getAllVoterData,
    voterArray,
    giveVote,
  } = useContext(VotingContext);
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      await getAllCandidateData();
      await getAllVoterData();
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getProfile = () => {
    voterArray.map((el) => {
      if (el[3] === account) {
        setProfile(el);
      }

      return el;
    });
  };

  const handleVote = async (data) => {
    try {
      setLoading(true);
      // Assuming giveVote returns a promise that resolves when the vote is successful
      await giveVote(data);

      // Update your component state or trigger a fetch for updated data
      fetchData();
      console.log('masuk sini');

      // Display a success toast or handle success in another way
      toast({
        type: 'success',
        icon: 'check circle',
        title: 'You successfully voted',
        animation: 'bounce',
        time: 3000,
      });
    } catch (error) {
      // Handle errors, display an error toast, or perform other error-handling logic
      console.error('Error voting:', error);
      console.log('masuk sana');
      toast({
        type: 'error',
        icon: 'close',
        title: 'Failed to vote',
        animation: 'bounce',
        time: 3000,
      });
    }
  };

  useEffect(() => {
    updateActiveItem('vote candidate', '#C5E898');
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, voterArray]);

  return (
    <div style={{ backgroundColor: '#0766AD' }}>
      <SemanticToastContainer position='top-right' />
      {loading ? ( // Render a placeholder while loading is true
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
      ) : candidateArray.length > 0 && profile[5] ? (
        <div>
          <Grid
            stackable
            columns={2}
            textAlign='left'>
            <Grid.Row>
              <Grid.Column width={4}>
                <Header
                  as='h1'
                  style={{ color: 'white', padding: 20, textAlign: 'center' }}>
                  Your Voted Candidate
                </Header>
                <Card.Group centered>
                  {candidateArray
                    .filter((candidate) => candidate[2] === profile[6])
                    .map((candidate) => (
                      <Card>
                        <Image
                          size='large'
                          src={candidate[3]}
                          wrapped
                          ui={false}
                        />
                        <Card.Content>
                          <Card.Header>{candidate[1]}</Card.Header>
                          <Card.Meta>Age: {candidate[0]}</Card.Meta>
                          <Card.Description>
                            {candidate[4]} Votes
                          </Card.Description>
                        </Card.Content>
                      </Card>
                    ))}
                </Card.Group>
              </Grid.Column>
              <Grid.Column width={12}>
                <Header
                  as='h1'
                  style={{ color: 'white', padding: 20, textAlign: 'center' }}>
                  Candidates
                </Header>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Card.Group
                    itemsPerRow={3}
                    stackable
                    style={{ width: '80%' }}>
                    {candidateArray
                      .filter((candidate) => candidate[2] !== profile[6])
                      .map((candidate) => (
                        <Card>
                          <Image
                            src={candidate[3]}
                            wrapped
                            ui={false}
                          />
                          <Card.Content>
                            <Card.Header>{candidate[1]}</Card.Header>
                            <Card.Meta>Age: {candidate[0]}</Card.Meta>
                            <Card.Description>
                              {candidate[4]} Votes
                            </Card.Description>
                            {!profile[5] ? (
                              <Button
                                fluid
                                size='medium'
                                style={{
                                  backgroundColor: '#29ADB2',
                                  color: 'white',
                                  marginTop: 20,
                                }}
                                onClick={() =>
                                  handleVote({
                                    id: candidate[2],
                                    address: candidate[5],
                                  })
                                }>
                                Vote
                              </Button>
                            ) : (
                              <></>
                            )}
                          </Card.Content>
                        </Card>
                      ))}
                  </Card.Group>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      ) : candidateArray.length > 0 ? (
        <div>
          <Header
            as='h1'
            style={{ color: 'white', padding: 20, textAlign: 'center' }}>
            Candidates
          </Header>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card.Group
              itemsPerRow={3}
              stackable
              style={{ width: '80%' }}>
              {candidateArray
                .filter((candidate) => candidate[2] !== profile[6])
                .map((candidate) => (
                  <Card>
                    <Image
                      src={candidate[3]}
                      wrapped
                      ui={false}
                    />
                    <Card.Content>
                      <Card.Header>{candidate[1]}</Card.Header>
                      <Card.Meta>Age: {candidate[0]}</Card.Meta>
                      <Card.Description>{candidate[4]} Votes</Card.Description>
                      {!profile[5] ? (
                        <Button
                          fluid
                          size='medium'
                          style={{
                            backgroundColor: '#29ADB2',
                            color: 'white',
                            marginTop: 20,
                          }}
                          onClick={() =>
                            giveVote({
                              id: candidate[2],
                              address: candidate[5],
                            })
                          }>
                          Vote
                        </Button>
                      ) : (
                        <></>
                      )}
                    </Card.Content>
                  </Card>
                ))}
            </Card.Group>
          </div>
        </div>
      ) : (
        console.log()
      )}
    </div>
  );
};

export default VoteCandidate;
