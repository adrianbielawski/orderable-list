import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './item.scss'
//Types
import { AnimationDirection } from 'src/types'
//Contexts
import { useListContext } from 'list/orderable-list-store/reducer'
import { ItemContext } from './item-store/itemContext'
//Components
import AnimateHeight from 'react-animate-height'

const cx = classNames.bind(styles)

type Props<T> = {
    className?: string;
    animationDirection?: AnimationDirection;
    transition: boolean;
    transform: boolean;
    item: T;
    index: number;
    children: React.ReactNode;
    onDrop: (prevPosition: number, newPosition: number) => void;
    onRemove: (item: T) => void;
}

type DynamicStyles = {
    transform: string | boolean;
    top?: number;
    left?: number;
    width?: number;
}

const Item: React.FC<Props<any>> = (props) => {
    const { grabbedElement, changeItemDimensions } = useListContext()
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const element = useRef<HTMLLIElement>(null)
    const [itemRemoved, setItemRemoved] = useState(false)
    const [height, setHeight] = useState<'auto' | 0>('auto')

    const isGrabbed = grabbedElement?.index === props.index

    const handleRemove = () => {
        setItemRemoved(true)
        timeout.current = setTimeout(
            () => setHeight(0),
            400
        )
        timeout.current = setTimeout(
            () => props.onRemove!(props.index),
            500
        )
    }

    useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current)
            }
        }
    }, [])

    useEffect(() => {
        if (element.current !== null) {
            const dimensions = element.current.getBoundingClientRect()
            changeItemDimensions(props.index, { height: dimensions.height })
        }
    }, [props.index, props.item, grabbedElement])

    const getDynamicStyles = () => {
        if (!grabbedElement) {
            return {}
        }

        let styles: DynamicStyles = {
            transform: props.transform && `translate(0px, ${grabbedElement.height}px)`,
        }

        if (isGrabbed) {
            styles = {
                ...styles,
                top: grabbedElement.coords.top,
                left: grabbedElement.coords.left,
                width: grabbedElement.width,
            }
        }

        return styles
    }

    const itemClass = cx(
        'item',
        props.className,
        {
            grabbed: isGrabbed,
            transition: props.transition,
            removed: itemRemoved,
        }
    )

    const contentClass = cx(
        'content',
        {
            removeToRight: itemRemoved && props.animationDirection === 'right',
        }
    )

    const itemContext = {
        element,
        index: props.index,
        onRemove: handleRemove,
        onDrop: props.onDrop,
    }

    return (
        <ItemContext.Provider value={itemContext}>
            <li
                className={itemClass}
                style={getDynamicStyles()}
                ref={element}
            >
                <AnimateHeight
                    className={contentClass}
                    height={height}
                    duration={100}
                >
                    {props.children}
                </AnimateHeight>
            </li>
        </ItemContext.Provider>
    )
}

Item.defaultProps = {
    className: undefined,
    animationDirection: 'left',
    transition: false,
    transform: false,
    item: undefined,
    index: undefined,
    children: undefined
}

export default Item