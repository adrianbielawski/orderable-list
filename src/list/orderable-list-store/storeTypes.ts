export const DEVICE_INSPECTED = 'DEVICE_INSPECTED'
export const ELEMENT_GRABBED = 'ELEMENT_GRABBED'
export const ENABLE_TRANSITION = 'ENABLE_TRANSITION'
export const ELEMENT_MOVED = 'ELEMENT_MOVED'
export const MOUSE_LEFT = 'MOUSE_LEFT'
export const ITEMS_REORDERED = 'ITEMS_REORDERED'
export const DROPPED_UNCHANGED = 'DROPPED_UNCHANGED'
export const ITEMS_CHANGED = 'ITEMS_CHANGED'

export interface DeviceInspected {
    type: typeof DEVICE_INSPECTED;
    isTouchDevice: boolean;
}

export interface ElementGrabbed {
    type: typeof ELEMENT_GRABBED;
    grabbedElement: GrabbedElement;
}

export interface EnableTransition {
    type: typeof ENABLE_TRANSITION;
}

export interface ElementMoved {
    type: typeof ELEMENT_MOVED;
    coords: Coords;
    distance: number | null;
    scrollStep: number | null;
}

export interface MouseLeft {
    type: typeof MOUSE_LEFT;
}

export interface ItemsReordered<T> {
    type: typeof ITEMS_REORDERED;
    items: T[];
}

export interface DroppedUnchanged {
    type: typeof DROPPED_UNCHANGED;
}

export interface ItemsChanged<T> {
    type: typeof ITEMS_CHANGED;
    items: T[];
}

export type Action = DeviceInspected
    | ElementGrabbed
    | EnableTransition
    | ElementMoved
    | MouseLeft
    | ItemsReordered<any>
    | DroppedUnchanged
    | ItemsChanged<any>

export interface Coords {
    top: number;
    left: number;
}

export interface StartGrabCoords {
    x: number;
    y: number;
}

export interface GrabbedElement {
    index: number;
    width: number;
    height: number;
    startCoords: Coords;
    coords: Coords;
    startGrabCoords: StartGrabCoords;
}

export type InitialState<T> = {
    isTouchDevice: boolean | null;
    items: T[];
    grabbedElement: GrabbedElement | null;
    distance: number | null;
    scrollStep: number | null;
    initialTopOffset: number | null;
    transition: boolean;
    scrollTopAt: number;
    scrollBottomAt: number;
    deviceInspected: (isTouchDevice: boolean) => void;
    elementGrabbed: (grabbedElement: GrabbedElement) => void;
    enableTransition: () => void;
    elementMoved: (
        coords: Coords,
        distance: number | null,
        scrollStep: number | null,
    ) => void;
    mouseLeft: () => void;
    itemsReordered: (items: any[]) => void;
    droppedUnchanged: () => void;
    itemsChanged: (items: any[]) => void;
}