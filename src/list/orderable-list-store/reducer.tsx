import { createContext, useContext } from 'react'
import { Draft } from 'immer'
import * as T from './storeTypes'

export const initialState = {
    isTouchDevice: null,
    items: [],
    grabbedElement: null,
    distance: null,
    scrollStep: null,
    initialTopOffset: 0,
    transition: false,
    scrollTopAt: 30,
    scrollBottomAt: 30,
    deviceInspected: () => { },
    elementGrabbed: () => { },
    enableTransition: () => { },
    elementMoved: () => { },
    mouseLeft: () => { },
    itemsReordered: () => { },
    droppedUnchanged: () => { },
    itemsChanged: () => { },
}

export const ListContext = createContext<T.InitialState<any>>({ ...initialState })

export const useListContext = () => useContext(ListContext)

export const reducer = (state: Draft<T.InitialState<any>>, action: T.Action) => {
    switch (action.type) {
        case T.DEVICE_INSPECTED:
            state.isTouchDevice = action.isTouchDevice
            break
        case T.ELEMENT_GRABBED:
            state.grabbedElement = action.grabbedElement
            state.distance = 0
            state.initialTopOffset = window.pageYOffset
            break
        case T.ENABLE_TRANSITION:
            state.transition = true
            break
        case T.ELEMENT_MOVED:
            if (state.grabbedElement) {
                state.grabbedElement!.coords = action.coords
                state.distance = action.distance
                state.scrollStep = action.scrollStep
            }
            break
        case T.DROPPED_UNCHANGED:
        case T.MOUSE_LEFT:
            Object.assign(state, {
                ...initialState,
                    items: state.items,
                    isTouchDevice: state.isTouchDevice,
                    scrollTopAt: state.scrollTopAt,
                    scrollBottomAt: state.scrollBottomAt,
            })
            break
        case T.ITEMS_REORDERED:
            Object.assign(state, {
                ...initialState,
                    items: action.items,
                    isTouchDevice: state.isTouchDevice,
                    scrollTopAt: state.scrollTopAt,
                    scrollBottomAt: state.scrollBottomAt,
            })
            break
        case T.ITEMS_CHANGED:
            state.items = action.items
            break
        default:
            throw new Error()
    }
}