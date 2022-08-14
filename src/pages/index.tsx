import {NextPage} from 'next';
import {useLobby} from '../application/hooks/useLobby';

const HomePage: NextPage = () => {
  const {
    board,
    connected,
    isReleased,
    playersList,
  } = useLobby();


  return <div>
    <h1>TFT</h1>
    {
      !connected && <p
      >Conectando...</p>
    }
    {
      board && board.getAll().map((character) => {
        return `${character.getCharacter().getName()} \
              with ${character.getItems()[0].getName()}`;
      })
    }
    {
      isReleased ? <p>Released to pick a char</p> : <p>Wait for</p>
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
