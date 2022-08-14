import axios from 'axios';
import {NextPage} from 'next';
import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import {SocketClient} from '../application/socket/SocketClient';
import {GamePlayerDTO} from '../domain/entities/Game/Game';
import {ICarouselBoard} from '../domain/entities/Game/RoundsManager/Carousel';
import {StartResponse} from './api/start';

const HomePage: NextPage = () => {
  const [board, setBoard] = useState<ICarouselBoard | null>(null);
  const [connected, setConnected] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [playersList, setPlayersList] = useState<GamePlayerDTO[]>([]);

  useEffect(() => {
    console.log('connecting..');

    axios.post<StartResponse>('/api/start')
        .then(({data}) => {
          setPlayersList(data.game.players);
        })
        .catch((error) => console.error(error));

    const socket: SocketClient = io();

    socket.on('connect', () => {
      console.log('SOCKET CONNECTED!', socket.id);
      setConnected(true);
    });

    socket.on('carouselStart', (board) => {
      setBoard(board);
    });

    socket.on('releasePlayers', () => {
      setIsReleased(true);
    });

    socket.on('playerAdded', (playersList) => {
      console.log('player added on client');
      setPlayersList(playersList);
    });

    socket.on('playerDisconnected', (playersList) => {
      console.log('player disconnected on client');
      setPlayersList(playersList);
    });

    socket.on('playerReconnected', (playersList) => {
      console.log('player disconnected on client');
      setPlayersList(playersList);
    });
  }, []);

  return <div>
    <h1>TFT</h1>
    {
      !connected && <p>Conectando...</p>
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
