import { CompositeOperator } from '@imagemagick/magick-wasm';

export default function getCompositeOperator(
  input: unknown
): CompositeOperator {
  const compositeOperator =
    CompositeOperator[input as keyof typeof CompositeOperator];
  if (!compositeOperator) {
    throw new Error('Unknown composite operator');
  }

  return compositeOperator;
}
