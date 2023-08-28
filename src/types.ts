export type AnimationDirection = "left" | "right";

export type ItemComponentProps<T> = {
  index: number;
  item: T;
  grabbed: boolean;
};

export type OnDropParams<T> = {
  prevPosition: number;
  newPosition: number;
  item: T;
  newItems: T[];
};

export type OnRemoveParams<T> = {
  item: T;
  newItems: T[];
};
