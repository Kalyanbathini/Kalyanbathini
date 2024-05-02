import React, { useContext, useEffect, useState } from 'react';
import {
  Item,
  Pagination,
  Card,
  Header,
  Container,
  Placeholder,
} from 'semantic-ui-react';
import { VotingContext } from '../utils/Voter';

const EventsList = ({ updateActiveItem }) => {
  const itemsPerPage = 1;
  const { eventsArray, getAllEventsData } = useContext(VotingContext);

  const startIndex = 0;
  const endIndex = itemsPerPage;
  const [currentEventPagination, setCurrentEventPagination] = useState(1);
  const [currentEventPaginationItems, setCurrentEventPaginationItems] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const handleEventsPaginationChange = (latestActivePage) => {
    setCurrentEventPagination(latestActivePage);
    const startIndex = (latestActivePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentEventPaginationItems(eventsArray.slice(startIndex, endIndex));
  };

  const fetchData = async () => {
    try {
      await getAllEventsData();
      setLoading(false);
    } catch (error) {
      console.error('ERROR: ', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    updateActiveItem('events list', '#C5E898');
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) {
      setCurrentEventPaginationItems(eventsArray.slice(startIndex, endIndex));
    }
  }, [loading, eventsArray, startIndex, endIndex]);

  return (
    <div>
      {loading ? (
        <div style={{ padding: '2rem' }}>
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
        </div>
      ) : eventsArray.length > 0 ? (
        <div style={{ padding: 20 }}>
          <Card
            fluid
            centered
            style={{ width: '80%' }}>
            <Header
              as='h1'
              style={{
                paddingTop: 20,
                color: '#0766AD',
                textTransform: 'uppercase',
              }}>
              List of Events Organized
            </Header>
            {currentEventPaginationItems.length > 0 ? (
              <Item.Group divided>
                {currentEventPaginationItems.map((el, i) => (
                  <Item
                    key={el[2]}
                    style={{ padding: 20, textAlign: 'left' }}>
                    <Item.Image
                      size='large'
                      src={el[3]}
                      style={{
                        width: '40%',
                        objectFit: 'cover',
                      }}
                    />
                    <Item.Content>
                      <Item.Header as='h1'>{el[1]}</Item.Header>
                      <Item.Description>Description: {el[2]}</Item.Description>
                      <Item.Extra>
                        Dated: {el[4].split('T')[1].split('.')[0]},{' '}
                        {el[4].split('T')[0].split('-').reverse().join('-')}
                      </Item.Extra>
                    </Item.Content>
                  </Item>
                ))}
              </Item.Group>
            ) : (
              <Container style={{ padding: 20 }}>
                <Header
                  as='h3'
                  style={{ color: '#777777' }}>
                  No Events Organized, Yet!
                </Header>
              </Container>
            )}

            <div
              style={{
                textAlign: 'center',
                position: 'absolute',
                bottom: 10,
                width: '100%',
              }}>
              <Pagination
                activePage={currentEventPagination}
                totalPages={Math.ceil(eventsArray.length / itemsPerPage)}
                onPageChange={(event, { activePage }) =>
                  handleEventsPaginationChange(activePage)
                }
              />
            </div>
            <div style={{ height: 50 }}></div>
          </Card>
        </div>
      ) : (
        <div style={{ padding: 20 }}>
          <Card
            fluid
            centered
            style={{ width: '80%' }}>
            <Container style={{ padding: 20 }}>
              <Header
                as='h3'
                style={{ color: '#777777' }}>
                No Events Organized, Yet!
              </Header>
            </Container>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EventsList;
