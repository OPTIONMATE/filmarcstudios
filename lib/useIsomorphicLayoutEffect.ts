"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` on the client, `useEffect` during server rendering.
 *
 * Scroll timelines must be built *before* the browser paints, or the first
 * frame is painted in the un-animated state and the visitor sees a flash. React
 * warns loudly when `useLayoutEffect` runs on the server, so swap in `useEffect`
 * there — where it is never actually invoked.
 */
export const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
