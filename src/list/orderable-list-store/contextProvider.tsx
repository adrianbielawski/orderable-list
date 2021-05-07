import React, { ReactNode } from 'react'
import { useImmerReducer } from 'use-immer'
import { ListContext, reducer } from './reducer'
import * as T from './storeTypes'

type Props<T> = {
    children: ReactNode;
    value: T.InitialState<T>;
}

export const ListContextProvider = (props: Props<any>) => {
    const initialState = {
        ...props.value,
    }

    const [state, dispatch] = useImmerReducer(reducer, initialState)

    const deviceInspected = (isTouchDevice: boolean) => {
        dispatch({
            type: T.DEVICE_INSPECTED,
            isTouchDevice,
        })
    }

    const changeItemDimensions = (index: number, dimensions: T.ItemDimensions) => {
        dispatch({
            type: T.CHANGE_ITEM_DIMENSIONS,
            index,
            dimensions,
        })
    }

    const elementGrabbed = (grabbedElement: T.GrabbedElement) => {
        dispatch({
            type: T.ELEMENT_GRABBED,
            grabbedElement,
        })
    }

    const enableTransition = () => {
        dispatch({ type: T.ENABLE_TRANSITION })
    }

    const elementMoved = (
        coords: T.Coords,
        distance: number | null,
        scrollStep: number | null,
    ) => {
        dispatch({
            type: T.ELEMENT_MOVED,
            coords,
            distance,
            scrollStep,
        })
    }

    const mouseLeft = () => {
        dispatch({
            type: T.MOUSE_LEFT,
        })
    }

    const itemsReordered = (items: any[]) => {
        dispatch({
            type: T.ITEMS_REORDERED,
            items,
        })
    }

    const droppedUnchanged = () => {
        dispatch({
            type: T.DROPPED_UNCHANGED,
        })
    }

    const itemsChanged = (items: any[]) => {
        dispatch({
            type: T.ITEMS_CHANGED,
            items,
        })
    }

    const itemRemoved = (index: number, items: any[]) => {
        dispatch({
            type: T.ITEM_REMOVED,
            index,
            items,
        })
    }

    const context = {
        ...state,
        deviceInspected,
        changeItemDimensions,
        elementGrabbed,
        enableTransition,
        elementMoved,
        mouseLeft,
        itemsReordered,
        droppedUnchanged,
        itemsChanged,
        itemRemoved,
    }

    return (
        <ListContext.Provider value={context}>
            {props.children}
        </ListContext.Provider>
    )
}