import React, { forwardRef } from 'react'
import { useItemContext } from '../item-store/itemContext'

const RemoveButton: React.ForwardRefRenderFunction<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props, ref) => {
    const { onRemove } = useItemContext()

    return (
        <button
            ref={ref}
            onClick={onRemove}
            {...props}
        >
            {props.children}
        </button>
    )
}

export default forwardRef(RemoveButton)