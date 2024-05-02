import React, { useContext, useEffect, useState } from 'react';
import { VotingContext } from '../utils/Voter';
import { Card, Header, Image, Item, Placeholder } from 'semantic-ui-react';

const CandidateProfile = ({ account, updateActiveItem }) => {
  const { getAllCandidateData, candidateArray, getAllVoterData } =
    useContext(VotingContext);
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    candidateArray.map((el) => {
      if (el[5] === account) {
        setProfile(el);
      }

      return el;
    });
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
    updateActiveItem('candidate profile', '#C5E898');
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, candidateArray]);

  return (
    <div style={{ backgroundColor: '#0766AD' }}>
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
      ) : candidateArray.length > 0 ? (
        <div>
          <Header
            as='h1'
            style={{ color: 'white', padding: 20 }}>
            My Profile
          </Header>
          <Card
            fluid
            centered
            style={{ width: '80%' }}>
            <Item.Group>
              <Item style={{ padding: 20, textAlign: 'left' }}>
                <Item.Image
                  size='small'
                  src={profile[3]}
                />
                <Item.Content>
                  <Item.Header style={{ fontSize: '32px', paddingTop: 20 }}>
                    {profile[1]}
                  </Item.Header>
                  <Item.Description>Age: {profile[0]}</Item.Description>
                  <Item.Description>Votes: {profile[4]}</Item.Description>
                  <Item.Description>MetaMask: {profile[5]}</Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
          </Card>
          {candidateArray.length > 0 ? (
            <div>
              <Header
                as='h1'
                style={{ color: 'white', padding: 20 }}>
                Other Candidates
              </Header>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card.Group
                  itemsPerRow={3}
                  stackable
                  style={{ width: '80%' }}>
                  {candidateArray
                    .filter((candidate) => candidate[2] !== profile[2])
                    .map((candidate) => (
                      <Card key={candidate[2]}>
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
                        </Card.Content>
                      </Card>
                    ))}
                </Card.Group>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        console.log()
      )}
    </div>
  );
};

export default CandidateProfile;
