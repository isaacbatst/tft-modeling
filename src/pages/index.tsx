import {NextPage} from 'next';
import {useLobby} from '../application/hooks/useLobby';

const HomePage: NextPage = () => {
  const {
    connected,
    playersList,
  } = useLobby();


  return (
    <div>
      <h1>TFT</h1>
      {
        connected ?
        (
          playersList.map((player) => (
            <div key={player.id}>{JSON.stringify(player)}</div>
          ))
        ) :
        (
          <div>Conectando...</div>
        )
      }
    </div>
  );
};

export default HomePage;
