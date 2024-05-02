import EventRegistry from './contracts/EventRegistry.json';

const Events = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = EventRegistry.networks[networkId];

  return new web3.eth.Contract(
    EventRegistry.abi,
    deployedNetwork && deployedNetwork.address
  );
};

export default Events;
