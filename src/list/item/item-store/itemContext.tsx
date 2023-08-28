import { createContext, RefObject, useContext } from "react";

type ItemContextType<T> = {
  element: RefObject<HTMLLIElement> | null;
  index: number | null;
  onRemove: () => void;
  onDrop: (position: number, newPosition: number) => void;
};

const initialState = {
  element: null,
  index: null,
  onRemove: () => {},
  onDrop: () => {},
};

export const ItemContext = createContext<ItemContextType<any>>({
  ...initialState,
});

export const useItemContext = () => useContext(ItemContext);
