// app/(Frontend)/Components/Providers.jsx
'use client'; // 👈 Must be marked as a client component

import { Provider } from 'react-redux';
import { store } from '../app/ReduxToolkit/store';

export default function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
