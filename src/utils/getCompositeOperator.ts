import { CompositeOperator } from '@imagemagick/magick-wasm';

export function getCompositeOperator(input: unknown): CompositeOperator {
  const compositeOperator =
    CompositeOperator[input as keyof typeof CompositeOperator];
  if (!compositeOperator) {
    throw new Error('Unknown composite operator');
  }

  return compositeOperator;
}