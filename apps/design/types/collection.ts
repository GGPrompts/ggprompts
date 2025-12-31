import { CanvasPosition } from './canvas';
import { Customization } from './customization';

export type Collection = {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  components: SavedComponent[];
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
};

export type SavedComponent = {
  id: string;
  componentId: string;
  customization: Customization;
  notes?: string;
  order: number;
  canvasPosition?: CanvasPosition;
};
