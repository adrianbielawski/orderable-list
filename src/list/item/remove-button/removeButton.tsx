import React, {
  ButtonHTMLAttributes,
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { mergeRefs } from "src/utils/utils";
import { useItemContext } from "../item-store/itemContext";

const RemoveButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
> = (props, ref) => {
  const { onRemove } = useItemContext();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current !== null) {
      buttonRef.current.addEventListener("touchstart", handleMouseDown);
      buttonRef.current.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      if (buttonRef.current !== null) {
        buttonRef.current.removeEventListener("touchstart", handleMouseDown);
        buttonRef.current.removeEventListener("mousedown", handleMouseDown);
      }
    };
  }, []);

  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <button ref={mergeRefs([ref, buttonRef])} onClick={onRemove} {...props}>
      {props.children}
    </button>
  );
};

export default forwardRef(RemoveButton);
