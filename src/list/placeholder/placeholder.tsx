import React from "react";
import styles from "./placeholder.module.scss";

type Props = {
  height: number;
};

const Placeholder = (props: Props) => (
  <li
    className={styles.placeholder}
    style={{ height: `${props.height}px` }}
    key="placeholder"
  ></li>
);

Placeholder.defaultProps = {
  height: undefined,
  animationDirection: "left",
};

export default Placeholder;
