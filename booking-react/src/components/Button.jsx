import React from "react";

import styles from "./Button.module.css";

export default function Button({ text, type, handleClick }) {
  return (
    <button
      className={styles.button + " " + (text === "cancel" ? styles.cancel : "")}
      type={type}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
