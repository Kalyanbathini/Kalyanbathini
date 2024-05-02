import React, { useContext, useEffect, useState } from 'react';
import { Item, Pagination, Card, Header, Grid, Label, Container, Placeholder } from 'semantic-ui-react';
import { VotingContext } from '../utils/Voter';

const UserList = ({ updateActiveItem }) => {
  const itemsPerPage = 4

  const { getAllCandidateData, candidateArray, getAllVoterData, voterArray } = useContext(VotingContext);

  // State to manage the active page
  const [activeCandidatePage, setActiveCandidatePage] = useState(1);
  const [activeVoterPage, setActiveVoterPage] = useState(1);

  // Calculate the start and end index of items for the current page
  const startIndex = 0;
  const endIndex = 4;
  const [currCandidateItem, setCurrCandidateItem] = useState([]);
  const [currVoterItem, setCurrVoterItem] = useState([]);

  const [loading, setLoading] = useState(true);

  // Handler for candidate page change
  const handleCandidatePageChange = (latestActivePage) => {
    setActiveCandidatePage(latestActivePage);
    const startIndex = (latestActivePage - 1) * 4;
    const endIndex = startIndex + 4;
    setCurrCandidateItem(candidateArray.slice(startIndex, endIndex));
  };

  // Handler for page change
  const handleVoterPageChange = (latestActivePage) => {
    console.log(latestActivePage);
    setActiveVoterPage(latestActivePage);
    const startIndex = (latestActivePage - 1) * 4;
    const endIndex = startIndex + 4;
    setCurrVoterItem(voterArray.slice(startIndex, endIndex));
  };

  const fetchData = async () => {
    try {
      console.log("Fetching candidate data...");
      await getAllCandidateData();

      console.log("Fetching voter data...");
      await getAllVoterData();

      console.log("Data fetching completed.");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    updateActiveItem('user list', '#C5E898');
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loading) {
      setCurrCandidateItem(candidateArray.slice(startIndex, endIndex));
      setCurrVoterItem(voterArray.slice(startIndex, endIndex));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, voterArray]);

  return (
    <div>
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
        <div style={{ padding: 20 }}>
          <Grid stackable columns={2}>
            <Grid.Row>
              <Grid.Column width={8}>
                <Card fluid centered style={{ width: '80%' }}>
                  <Header as='h2' style={{ paddingTop: 20, color: '#0766AD' }}>
                    Candidate List
                  </Header>
                  {currCandidateItem.length > 0 ? (
                    <Item.Group divided>
                      {currCandidateItem.map((el, i) => (
                        <Item key={el[2]} style={{ padding: 20, textAlign: 'left' }}>
                          <Item.Image size='tiny' src={el[3]} />
                          <Item.Content>
                            <Item.Header as='h2'>{el[1]}</Item.Header>
                            <Item.Description>Age: {el[0]}</Item.Description>
                            <Item.Extra>{el[4]} Votes</Item.Extra>
                          </Item.Content>
                        </Item>
                      ))}
                    </Item.Group>
                  ) : (
                    <Container style={{ padding: 20 }}>
                      <Header as='h3' style={{ color: "#29ADB2" }}>No candidate registered</Header>
                    </Container>
                  )}

                  <div style={{ textAlign: 'center', position: 'absolute', bottom: 10, width: '100%' }}>
                    <Pagination
                      activePage={activeCandidatePage}
                      totalPages={Math.ceil(candidateArray.length / itemsPerPage)}
                      onPageChange={(event, { activePage }) => handleCandidatePageChange(activePage)}
                    />
                  </div>
                  <div style={{ height: 50 }}></div>
                </Card>
              </Grid.Column>
              <Grid.Column width={8}>
                <Card fluid centered style={{ width: '80%', height: '100%' }}>
                  <Header as='h2' style={{ paddingTop: 20, color: '#0766AD' }}>
                    Voter List
                  </Header>

                  {currVoterItem.length > 0 ? (
                    <Item.Group divided>
                      {currVoterItem.map((el, i) => (
                        <Item key={el[0]} style={{ padding: 20, textAlign: 'left' }}>
                          <Item.Image size='tiny' src={el[2]} />

                          <Item.Content>
                            <Item.Header as='h2'>{el[1]}</Item.Header>
                            <Item.Description>
                              <Label color={el[5] ? "green" : "red"}>
                                {el[5] ? "Voted" : "Not Voted"}
                              </Label>
                            </Item.Description>
                          </Item.Content>
                        </Item>
                      ))}
                    </Item.Group>
                  ) : (
                    <Container style={{ padding: 20 }}>
                      <Header as='h3' style={{ color: "#29ADB2" }}>No voter registered</Header>
                    </Container>
                  )}

                  <div style={{ textAlign: 'center', position: 'absolute', bottom: 10, width: '100%' }}>
                    <Pagination
                      activePage={activeVoterPage}
                      totalPages={Math.ceil(voterArray.length / itemsPerPage)}
                      onPageChange={(event, { activePage }) => handleVoterPageChange(activePage)}
                    />
                  </div>
                  <div style={{ height: 50 }}></div>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>) : (
        <div style={{ padding: 20 }}>
          <Card
            fluid
            centered
            style={{ width: '80%' }}>
            <Container style={{ padding: 20 }}>
              <Header
                as='h3'
                style={{ color: '#777777' }}>
                No Candidates or Voters Registered, Yet!
              </Header>
            </Container>
          </Card>
        </div>
      )}
    </div>
  )
}

export default UserList