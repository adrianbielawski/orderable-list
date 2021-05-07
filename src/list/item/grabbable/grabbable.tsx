import React, { forwardRef, useCallback, useEffect, useRef } from 'react'
//Utils
import { mergeRefs } from 'src/utils/utils'
import { SCROLL_FREQUENCY, SCROLL_STEP } from 'src/utils/constants'
//Context
import { useItemContext } from 'list/item/item-store/itemContext'
import { useListContext } from 'list/orderable-list-store/reducer'

const Grabbable: React.ForwardRefRenderFunction<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
> = (props, ref) => {
    const {
        isTouchDevice,
        items,
        itemsDimensions,
        grabbedElement,
        scrollStep,
        initialTopOffset,
        distance,
        scrollTopAt,
        scrollBottomAt,
        elementGrabbed,
        elementMoved,
        mouseLeft,
        itemsReordered,
    } = useListContext()
    const itemContext = useItemContext()
    const elementRef = useRef<HTMLDivElement | null>(null)
    const scrollInterval = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleGrab = useCallback(
        (e: TouchEvent | MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if ((e as MouseEvent).buttons === 2) {
                return
            }

            if (items.length === 1) {
                return
            }

            if (e.type === 'touchstart' && (e as TouchEvent).touches.length > 1) {
                return
            }

            const elRect = itemContext.element!.current!.getBoundingClientRect()
            const startCoords = { top: elRect.y, left: elRect.x }
            const elementW = elRect.width
            const elementH = elRect.height

            let startX, startY
            if (e.type === 'mousedown') {
                startX = (e as MouseEvent).clientX
                startY = (e as MouseEvent).clientY
            } else {
                startX = (e as TouchEvent).touches[0].clientX
                startY = (e as TouchEvent).touches[0].clientY
            }
            const startGrabCoords = { x: startX, y: startY }

            elementGrabbed({
                index: itemContext.index!,
                width: elementW,
                height: elementH,
                startCoords: startCoords,
                coords: startCoords,
                startGrabCoords: startGrabCoords,
            })
        },
        [itemContext, grabbedElement, elementGrabbed]
    )

    const getDistance = (top: number) => {
        let moveDistance = (
            top + window.pageYOffset - initialTopOffset! - grabbedElement!.startCoords.top
        )

        let distance = 0

        if (moveDistance > 0) {
            let totalHeight = 0
            for (let i = itemContext.index! + 1; i < items.length; i++) {
                const height = itemsDimensions[i].height
                if (moveDistance - totalHeight >= height) {
                    distance += 1
                    totalHeight += height
                } else {
                    if(moveDistance - totalHeight >= height / 2) {
                        distance += 1
                    }
                    break
                }
            }
        }

        if (moveDistance < 0) {
            let totalHeight = 0
            for (let i = itemContext.index! - 1; i >= 0; i--) {
                const height = itemsDimensions[i].height
                if (moveDistance - totalHeight <= -height) {
                    distance -= 1
                    totalHeight -= height
                } else {
                    if(moveDistance - totalHeight <= -(height / 2)) {
                        distance -= 1
                    }
                    break
                }
            }
        }

        return distance
    }

    const move = useCallback(
        (e: TouchEvent | MouseEvent) => {
            e.stopPropagation()
            if (!grabbedElement) {
                return
            }

            let x, y
            if (e.type === 'touchmove') {
                x = (e as TouchEvent).touches[0].clientX
                y = (e as TouchEvent).touches[0].clientY
            } else if ((e as MouseEvent).buttons > 0) {
                x = (e as MouseEvent).clientX
                y = (e as MouseEvent).clientY
            } else {
                // no button pressed and it's not a touch event
                return
            }

            let scrollStep = null
            if (y >= window.innerHeight - scrollBottomAt) {
                scrollStep = SCROLL_STEP
            } else if (y <= scrollTopAt) {
                scrollStep = -SCROLL_STEP
            }

            const top = y - grabbedElement.startGrabCoords.y + grabbedElement.startCoords.top
            const left = x - grabbedElement.startGrabCoords.x + grabbedElement.startCoords.left
            
            const distance = getDistance(top)

            elementMoved({ top, left }, distance, scrollStep)
        },
        [grabbedElement, initialTopOffset, elementMoved]
    )

    const handleDrop = useCallback(
        (e: TouchEvent | MouseEvent) => {
            if (scrollInterval.current) {
                clearInterval(scrollInterval.current)
                scrollInterval.current = null
            }

            if (items.length === 1) {
                return
            }

            if (e.type === 'touchend' && (e as TouchEvent).touches.length > 0) {
                return
            }

            let newPosition = itemContext.index! + distance!
            if (newPosition < 1) {
                newPosition = 0
            } else if (newPosition >= items.length) {
                newPosition = items.length - 1
            }

            itemContext.onDrop(itemContext.index!, newPosition)
        },
        [scrollInterval.current, itemContext, distance, items, itemContext.onDrop, itemsReordered]
    )

    const onMouseLeave = () => {
        if (scrollInterval.current !== null) {
            clearInterval(scrollInterval.current)
            scrollInterval.current = null
        }
        mouseLeft()
    }

    const doScroll = () => {
        if (scrollStep! > 0 && window.innerHeight + window.pageYOffset >= document.body.clientHeight) {
            return
        }
        if (scrollStep! < 0 && window.pageYOffset <= 0) {
            return
        }

        window.scrollBy({
            top: scrollStep!,
            left: 0,
            behavior: 'smooth',
        })
    }

    useEffect(() => {
        if (scrollStep === null || !grabbedElement) {
            return
        }

        if (scrollInterval.current === null && itemContext.index === grabbedElement.index) {
            scrollInterval.current = setInterval(doScroll, SCROLL_FREQUENCY)
        }

        return () => {
            if (scrollInterval.current !== null) {
                clearInterval(scrollInterval.current)
                scrollInterval.current = null
            }
        }
    }, [scrollStep, grabbedElement?.index, itemContext.index])

    useEffect(() => {
        if (elementRef.current) {
            if (isTouchDevice) {
                elementRef.current.addEventListener('touchstart', handleGrab, { passive: false })
            } else {
                elementRef.current.addEventListener('mousedown', handleGrab)
            }
        }

        return () => {
            if (elementRef.current) {
                elementRef.current.removeEventListener('touchstart', handleGrab)
                elementRef.current.removeEventListener('mousedown', handleGrab)
            }
        }
    }, [handleGrab])

    useEffect(() => {
        if (!grabbedElement
            || !elementRef.current
            || grabbedElement.index !== itemContext.index
        ) {
            return
        }

        if (isTouchDevice) {
            window.addEventListener('touchmove', move)
            elementRef.current!.addEventListener('touchend', handleDrop)
        } else {
            window.addEventListener('mousemove', move)
            elementRef.current!.addEventListener('mouseup', handleDrop)
        }

        document.body.addEventListener('mouseleave', onMouseLeave)

        return () => {
            window.removeEventListener('mousemove', move)
            window.removeEventListener('touchmove', move)
            document.body.removeEventListener('mouseleave', onMouseLeave)
            if (elementRef.current) {
                elementRef.current.removeEventListener('touchstart', handleGrab)
                elementRef.current.removeEventListener('touchend', handleDrop)
                elementRef.current.removeEventListener('mousedown', handleGrab)
                elementRef.current.removeEventListener('mouseup', handleDrop)
            }
        }
    }, [grabbedElement, itemContext.index, isTouchDevice, move,
        handleGrab,
        handleDrop,
        onMouseLeave,])

    return (
        <div {...props} ref={mergeRefs([elementRef, ref])}>
            {props.children}
        </div>
    )
}

export default forwardRef(Grabbable)