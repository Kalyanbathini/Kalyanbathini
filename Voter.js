import React, { useState } from 'react';

export const VotingContext = React.createContext();

export const VotingProvider = ({ children, account, voting, events }) => {
  const votingTitle = 'My first smart contract';

  // eslint-disable-next-line no-unused-vars
  const [currentAccount, setCurrentAccount] = useState(account);
  const [candidateLength, setCandidateLength] = useState('');
  const pushCandidate = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);

  const [error, setError] = useState('');

  const setCandidate = async (formData) => {
    try {
      const { avatar, name, address, age } = formData;

      await voting.methods
        .setCandidate(address, age, name, avatar)
        .send({ from: account });

      return true;
    } catch (error) {
      return false;
    }
  };

  const getAllCandidateData = async (id) => {
    try {
      const candidateListData = await voting.methods
        .getCandidate()
        .call({ from: account });

      for (let i = 0; i < candidateListData.length; i++) {
        const el = candidateListData[i];
        const singleCandidateData = await voting.methods
          .getCandidateData(el)
          .call({ from: account });
        pushCandidate.push(singleCandidateData);

        if (i === candidateListData.length - 1) {
          setCandidateArray(pushCandidate);
        }
      }

      const candidateLength = await voting.methods
        .getCandidateLength()
        .call({ from: account });
      setCandidateLength(candidateLength.toNumber());
    } catch (error) {
      setError('Something went wrong fetching data');
    }
  };

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState('');
  const [voterAddress, setVoterAddress] = useState([]);

  const createVoter = async (formData) => {
    try {
      const { avatar, name, address } = formData;

      await voting.methods
        .voterRight(address, name, avatar)
        .send({ from: account });

      return true;
    } catch (error) {
      return false;
    }
  };

  const getAllVoterData = async () => {
    try {
      const voterListData = await voting.methods
        .getVoterList()
        .call({ from: account });
      setVoterAddress(voterListData);

      for (let i = 0; i < voterListData.length; i++) {
        const el = voterListData[i];
        const singleVoterData = await voting.methods
          .getVoterData(el)
          .call({ from: account });
        pushVoter.push(singleVoterData);

        if (i === voterListData.length - 1) {
          setVoterArray(pushVoter);
        }
      }

      const voterLength = await voting.methods
        .getVoterLength()
        .call({ from: account });
      setVoterLength(voterLength.toNumber());
    } catch (error) {
      setError('Something went wrong fetching data');
    }
  };

  const giveVote = async (data) => {
    try {
      const candidateAddress = data.address;
      const candidateId = Number(data.id);
      await voting.methods
        .vote(candidateAddress, candidateId)
        .send({ from: account });
      return true;
    } catch (error) {
      setError('Something went wrong giving vote');
      return false;
    }
  };

  const eventsArray = [];
  // eslint-disable-next-line no-unused-vars
  const [eventsLength, setEventsLength] = useState('');
  const [eventsData, setEventsData] = useState([]);

  const getAllEventsData = async () => {
    try {
      const eventsListData = await events.methods
        .getAllEvents()
        .call({ from: account });

      for (let i = 0; i < eventsListData.length; i++) {
        const el = eventsListData[i];
        const singleEventData = await events.methods
          .getEvent(el[0])
          .call({ from: account });
        eventsArray.push(singleEventData);

        if (i === eventsListData.length - 1) {
          setEventsData(eventsArray);
        }
      }

      setEventsLength(eventsArray.length);
    } catch (error) {
      setError('Something went wrong fetching data');
    }
  };

  const setEvent = async (formData) => {
    try {
      const { title, description, date, imageUrl } = formData;

      await events.methods
        .addEvent(currentAccount, title, description, imageUrl, date)
        .send({ from: account });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <VotingContext.Provider
      value={{
        votingTitle,
        createVoter,
        getAllVoterData,
        giveVote,
        setCandidate,
        getAllCandidateData,
        getAllEventsData,
        setEvent,
        eventsArray: eventsData,
        error,
        voterArray,
        voterLength,
        voterAddress,
        currentAccount,
        candidateLength,
        candidateArray,
      }}>
      {children}
    </VotingContext.Provider>
  );
};

const Voter = () => {
  return <div>Voter</div>;
};

export default Voter;
