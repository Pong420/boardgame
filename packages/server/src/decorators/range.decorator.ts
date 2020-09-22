import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function DateRannge(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    Transform((payload: [string, string]) => {
      if (Array.isArray(payload)) {
        const [$gte, $lte] = payload;
        return { $gte, $lte };
      }
    })
  );
}
export function NumberRannge(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    Transform((payload: [number | string, number | string]) => {
      if (Array.isArray(payload)) {
        const [$gte, $lte] = payload.map(Number);
        return { $gte, $lte };
      }
    })
  );
}
