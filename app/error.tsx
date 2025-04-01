'use client';

import React from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h1>Valami hiba történt!</h1>
      <pre>{error.message}</pre>
      <button onClick={reset}>Újrapróbálkozás</button>
    </div>
  );
}
