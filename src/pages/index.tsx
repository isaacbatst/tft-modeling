import axios from 'axios';
import {NextPage} from 'next';
import {useLobby} from '../application/frontend/hooks/useLobby';

const HomePage: NextPage = () => {
  const {
    connected,
    token,
    playersList,
    roundManager,
    carousel,
  } = useLobby();

  const handleStart = async () => {
    try {
      await axios.post('/api/start');
    } catch (err) {
      console.error(err);
    }
  };

  const player = playersList.find((player) => player.id === token);

  return (
    <div>
      <h1>TFT</h1>
      {
        roundManager ? (
          <div>
            <div>
              {
                roundManager.stageRounds
                    .map((round) => <div>{round.name}</div>)
              }
            </div>
            <div>Agora: {roundManager.stage} - {roundManager.round}</div>
          </div>
        ) : (
          <div>Aguardando para começar...</div>
        )
      }
      {
        carousel && (
          <div>
            <h2>Carrossel</h2>
            <div>
              <h3>Personagens</h3>
              {
                carousel.board.map((character) => (
                  <div>{character.character.name} - {character.item.name}</div>
                ))
              }
            </div>
            <div>
              <h3>Duplas</h3>
              {
                carousel?.couples.map(([player1, player2]) => (
                  <div>{player1.id} e {player2.id}</div>
                ))
              }
            </div>
          </div>
        )
      }
      {
        connected ?
        (
          <div>
            <h2>Players</h2>
            {
              playersList.length === 0 && (
                <div>Nenhum jogador conectado</div>
              )
            }
            {
              playersList.map((player) => (
                <div
                  key={player.id}
                  className={player.id === token ? 'bg-slate-500' : ''}
                ><strong>Você</strong> {JSON.stringify(player)}</div>
              ))
            }
            {
              player && player.isOwner && (
                <button
                  className='border-2 px-5 py-1'
                  onClick={handleStart}
                >Iniciar</button>
              )
            }
          </div>
        ) :
        (
          <div>Conectando...</div>
        )
      }
    </div>
  );
};

export default HomePage;
