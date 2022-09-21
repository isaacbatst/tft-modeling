import {Games} from '../Games';

export interface ILobby {
  id: string;
  round: number;
  stage: number;
  game: Games
}
