import { createContext, RefObject, useContext } from 'react'

type ItemContexType<T> = {
    element: RefObject<HTMLLIElement> | null;
    index: number | null;
    onRemove: () => void;
    onDrop: (position: number, newPosition: number) => void;
}

const initialState = {
    element: null,
    index: null,
    onRemove: () => { },
    onDrop: () => { },
}

export const ItemContext = createContext<ItemContexType<any>>({ ...initialState })

export const useItemContext = () => useContext(ItemContext)