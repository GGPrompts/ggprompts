import { SavedComponent } from './collection';

export type CanvasPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
};

export type CanvasLayout = {
  id: string;
  collectionId: string;
  viewport: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  components: CanvasComponent[];
  grid: {
    size: number;
    show: boolean;
    snap: boolean;
  };
  guides: {
    show: boolean;
    positions: number[];
  };
};

export type CanvasComponent = SavedComponent & {
  position: CanvasPosition;
  locked: boolean;
  hidden: boolean;
  textContent?: Record<string, string>;  // { title: "My Title", buttonText: "Click Me" }
};
