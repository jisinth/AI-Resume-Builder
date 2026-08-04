/**
 * @react-pdf/renderer ships ESM-only, which Jest can't require() without a
 * transform pipeline for that package. It's a rendering library with no
 * business logic worth unit/e2e testing here (verified separately via a
 * real PDF export against the running API), so tests get a lightweight
 * stub instead of wiring up ESM transform support for one dependency.
 */
import { createElement, type ReactNode } from 'react';

function passthroughComponent({ children }: { children?: ReactNode } = {}) {
  return createElement('div', null, children);
}

export const Document = passthroughComponent;
export const Page = passthroughComponent;
export const View = passthroughComponent;
export const Text = passthroughComponent;
export const Link = passthroughComponent;

export const StyleSheet = {
  create: <T>(styles: T): T => styles,
};

export async function renderToBuffer(): Promise<Buffer> {
  return Buffer.from('');
}
