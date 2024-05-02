import Create from './contracts/Create.json';

const Voting = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = Create.networks[networkId];

  return new web3.eth.Contract(
    Create.abi,
    deployedNetwork && deployedNetwork.address
  );
};

export default Voting;
