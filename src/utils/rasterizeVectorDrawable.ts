import { readFileSync } from 'node:fs';

import { initWasm, Resvg } from '@resvg/resvg-wasm';
import { transform } from 'vector-drawable-svg';

let wasmInitialized = false;

async function ensureWasmInitialized(): Promise<void> {
  if (!wasmInitialized) {
    await initWasm(readFileSync(require.resolve('@resvg/resvg-wasm/index_bg.wasm')));
    wasmInitialized = true;
  }
}

export async function rasterizeSvg(svg: string, size: number): Promise<Uint8Array> {
  await ensureWasmInitialized();

  return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

/**
 * Rasterizes an Android VectorDrawable to a PNG by converting it to an SVG.
 * Only used to generate the sample previews; supports the common
 * VectorDrawable subset that converts cleanly to SVG.
 */
export default function rasterizeVectorDrawable(
  vectorDrawableFile: string,
  size: number,
): Promise<Uint8Array> {
  return rasterizeSvg(transform(readFileSync(vectorDrawableFile, 'utf-8')), size);
}
