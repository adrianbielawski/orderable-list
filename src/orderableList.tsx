import React, { ElementType, FC, ReactNode } from "react";
import { DEFAULT_SCROLL_AT } from "./utils/constants";
import { initialState } from "list/orderable-list-store/reducer";
import { ListContextProvider } from "list/orderable-list-store/contextProvider";
import List from "list/list";
import Grabbable from "list/item/grabbable/grabbable";
import RemoveButton from "list/item/remove-button/removeButton";
import {
  AnimationDirection,
  ItemComponentProps,
  OnDropParams,
  OnRemoveParams,
} from "./types";

type Props<T> = {
  items: T[];
  itemComponent: ElementType<ItemComponentProps<T>>;
  className?: string;
  itemClassName?: string;
  animationDirection?: AnimationDirection;
  scrollTopAt?: number;
  scrollBottomAt?: number;
  noItemsMessage?: ReactNode;
  onDrop?: (params: OnDropParams<T>) => void;
  onRemove?: (params: OnRemoveParams<T>) => void;
};

type OrderableListInterface = FC<Props<any>> & {
  RemoveButton: typeof RemoveButton;
  Grabbable: typeof Grabbable;
};

const OrderableList: OrderableListInterface = (props) => {
  const context = {
    ...initialState,
    items: props.items,
    scrollTopAt: props.scrollTopAt || DEFAULT_SCROLL_AT,
    scrollBottomAt: props.scrollBottomAt || DEFAULT_SCROLL_AT,
  };

  return (
    <ListContextProvider value={context}>
      <List {...props} />
    </ListContextProvider>
  );
};

OrderableList.RemoveButton = RemoveButton;
OrderableList.Grabbable = Grabbable;

export default OrderableList;
