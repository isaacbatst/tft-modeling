import {NextPage} from 'next';
import {useLobby} from '../application/hooks/useLobby';

const HomePage: NextPage = () => {
  const {
    connected,
    playersList,
  } = useLobby();


  return <div>
    <h1>TFT</h1>
    {
      !connected && <p
      >Conectando...</p>
    }
    <h2>Players</h2>
    {
      playersList.map((player) => {
        return <p key={player.id}>player: {JSON.stringify(player)}</p>;
      })
    }
  </div>;
};

export default HomePage;
