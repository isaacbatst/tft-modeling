import axios from 'axios';
import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import {GamePlayerDTO} from '../../../domain/entities/Game/Game';
import {
  CarouselState,
} from '../../../domain/entities/Game/RoundsManager/Carousel';
import {
  RoundsManagerState,
} from '../../../domain/usecases/GameStart/GameMoments';
import {LobbyResponse} from '../../../pages/api/lobby';
import {SocketClient} from '../../server/socket/SocketClient';

export const useLobby = () => {
  const [connected, setConnected] = useState(false);
  const [playersList, setPlayersList] = useState<GamePlayerDTO[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [
    roundManager, setRoundManager,
  ] = useState<RoundsManagerState | null>(null);
  const [carousel, setCarousel] = useState<CarouselState | null>(null);

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

    socket.on('playersUpdated', (playersList) => {
      console.log('player added on client');
      setPlayersList(playersList);
    });

    socket.on('roundStart', (roundStateManger) => {
      setRoundManager(roundStateManger);
    });

    socket.on('releasePlayers', (carouselState) => {
      setCarousel(carouselState);
    });
  }, []);

  return {
    connected,
    playersList,
    token,
    roundManager,
    carousel,
  };
};
