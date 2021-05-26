import React, { ElementType, useEffect, useCallback, ReactNode } from 'react'
import classNames from 'classnames/bind'
import styles from './list.scss'
import { cloneDeep } from 'lodash'
//Types
import * as T from 'src/types'
//Context
import { useListContext } from './orderable-list-store/reducer'
//Components
import Item from 'list/item/item'
import Placeholder from 'list/placeholder/placeholder'

const cx = classNames.bind(styles)

type Props<T> = {
    items: T[];
    itemComponent: ElementType<T.ItemComponentProps<T>>;
    className?: string;
    itemClassName?: string;
    animationDirection?: T.AnimationDirection;
    noItemsMessage?: ReactNode;
    onDrop?: (params: T.OnDropParams<T>) => void;
    onRemove?: (params: T.OnRemoveParams<T>) => void;
}

const List: React.FC<Props<any>> = (props) => {
    const {
        items,
        grabbedElement,
        distance,
        transition,
        enableTransition,
        deviceInspected,
        itemsReordered,
        droppedUnchanged,
        itemsChanged,
        itemRemoved,
    } = useListContext()

    useEffect(() => {
        deviceInspected(inspectDeviceScreen())
    }, [])

    useEffect(() => {
        itemsChanged(props.items)
    }, [props.items])

    useEffect(() => {
        if (grabbedElement === null || transition === true) {
            return
        }

        let animationFrame: number
        window.document.body.style.overscrollBehavior = 'contain'
        animationFrame = window.requestAnimationFrame(() => enableTransition())

        return () => {
            window.document.body.style.overscrollBehavior = 'unset'
            window.cancelAnimationFrame(animationFrame)
        }
    }, [grabbedElement, transition])

    const inspectDeviceScreen = () => {
        try {
            document.createEvent("TouchEvent")
            return true
        } catch (e) {
            return false
        }
    }

    const onDrop = useCallback(
        (prevPosition: number, newPosition: number) => {
            if (prevPosition === newPosition) {
                droppedUnchanged()
                return
            }

            let newItems = cloneDeep(items)
            newItems.splice(newPosition, 0, newItems.splice(prevPosition, 1)[0])

            itemsReordered(newItems)

            if (props.onDrop) {
                props.onDrop({
                    item: items[prevPosition],
                    prevPosition,
                    newPosition,
                    newItems: newItems,
                })
            }
        },
        [items, props.onDrop, droppedUnchanged, itemsReordered]
    )

    const onRemove = useCallback(
        (index: number) => {
            let newItems = cloneDeep(items)
            newItems.splice(index, 1)

            itemRemoved(index, newItems)

            if (props.onRemove) {
                props.onRemove({
                    item: items[index],
                    newItems,
                })
            }
        },
        [items, props.onRemove]
    )

    const getPlaceholder = () => {
        if (!grabbedElement) {
            return null
        }

        let placeholder = grabbedElement.index + distance!

        if (placeholder >= grabbedElement.index) {
            placeholder += 1
        }
        if (placeholder >= items.length) {
            placeholder = items.length
        }
        if (placeholder <= 0) {
            placeholder = 0
        }

        return placeholder
    }

    const getListItems = () => {
        const ItemComponent = props.itemComponent
        const placeholder = getPlaceholder()

        const listItems = items.map((item, index) => {
            let transform = placeholder === null ? false : placeholder <= index
            if (!grabbedElement || grabbedElement.index === index) {
                transform = false
            }

            return (
                <Item
                    key={`${index}/${items.length}`}
                    className={props.itemClassName}
                    animationDirection={props.animationDirection}
                    transition={transition}
                    transform={transform}
                    item={item}
                    index={index}
                    onDrop={onDrop}
                    onRemove={onRemove}
                >
                    <ItemComponent
                        item={item}
                        index={index}
                        grabbed={index === grabbedElement?.index}
                    />
                </Item>
            )
        })

        if (listItems.length === 0) {
            return props.noItemsMessage || <p className={styles.noItems}>No items</p>
        }

        if (grabbedElement) {
            listItems.push(
                <Placeholder
                    key={'placeholder'}
                    height={grabbedElement.height}
                />
            )
        }

        return listItems
    }

    const listClass = cx(
        'orderableList',
        props.className,
    )

    return (
        <ul className={listClass}>
            {getListItems()}
        </ul>
    )
}

export default List