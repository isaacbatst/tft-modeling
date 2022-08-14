import axios from 'axios';
import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import {GamePlayerDTO} from '../../domain/entities/Game/Game';
import {
  ICarouselBoard} from '../../domain/entities/Game/RoundsManager/Carousel';
import {LobbyResponse} from '../../pages/api/lobby';
import {SocketClient} from '../socket/SocketClient';

export const useLobby = () => {
  const [board, setBoard] = useState<ICarouselBoard | null>(null);
  const [connected, setConnected] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [playersList, setPlayersList] = useState<GamePlayerDTO[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    console.log('connecting..');

    axios.post<LobbyResponse>('/api/lobby')
        .then(({data}) => {
          setPlayersList(data.game.players);
          setToken(data.token);
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

  return {
    board,
    connected,
    isReleased,
    playersList,
    token,
  };
};
