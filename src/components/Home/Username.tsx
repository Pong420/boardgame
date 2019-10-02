import React, { useState, useCallback, ChangeEvent } from 'react';

interface Props {
  initialValue: string;
  onSubmit(value: string): void;
}

export function Username({ initialValue, onSubmit }: Props) {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => setValue(evt.target.value),
    []
  );

  const onSubmitCallback = useCallback(() => onSubmit(value), [
    value,
    onSubmit
  ]);

  return (
    <form className="username" onSubmit={onSubmitCallback}>
      <input name="username" value={value} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
