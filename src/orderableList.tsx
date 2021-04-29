import React, { ElementType } from 'react'
//Types
import * as T from 'src/types'
//Utils
import { DEFAULT_SCROLL_AT } from './utils/constants'
//Context
import { initialState } from 'list/orderable-list-store/reducer'
import { ListContextProvider } from 'list/orderable-list-store/contextProvider'
//Components
import List from 'list/list'
import Grabbable from 'list/item/grabbable/grabbable'
import RemoveButton from 'list/item/remove-button/removeButton'

type Props<T> = {
    items: T[];
    itemComponent: ElementType<T.ItemComponentProps<T>>;
    className?: string;
    itemClassName?: string;
    animationDirection?: T.AnimationDirection;
    scrollTopAt?: number;
    scrollBottomAt?: number;
    onDrop: (params: T.OnDropParams<T>) => void;
    onRemove?: (params: T.OnRemoveParams<T>) => void;
}

type OrderableListInterface = React.FC<Props<any>> & {
    RemoveButton: typeof RemoveButton,
    Grabbable: typeof Grabbable,
}

const OrderableList: OrderableListInterface = (props) => {
    const context = {
        ...initialState,
        items: props.items,
        scrollTopAt: props.scrollTopAt || DEFAULT_SCROLL_AT,
        scrollBottomAt: props.scrollBottomAt || DEFAULT_SCROLL_AT,
    }

    return (
        <ListContextProvider value={context}>
            <List {...props} />
        </ListContextProvider>
    )
}

OrderableList.RemoveButton = RemoveButton
OrderableList.Grabbable = Grabbable

export default OrderableList