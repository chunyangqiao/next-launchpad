"use client";

import * as React from "react";

export const FONT_READY_CLASS = "font-ready";

export const FONT_READY = FONT_READY_CLASS;

/**
 * @description
 */
export default function FontSwap() {
  React.useEffect(() => {
    function apply() {
      document.documentElement.classList.add(FONT_READY_CLASS);
      try {
        window.sessionStorage.setItem(FONT_READY, FONT_READY);
      } catch {
        // Privacy mode can make sessionStorage unavailable.
      }
    }

    let fontAlready = false;

    try {
      fontAlready = window.sessionStorage.getItem(FONT_READY) === FONT_READY;
    } catch {
      fontAlready = false;
    }

    if (fontAlready) {
      apply();
    }
  }, []);

  return null;
}
