import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import { ToastProvider } from './components/Toast';
import { UserMeasurementsProvider } from './context';
import { registerServiceWorker } from './registerServiceWorker';
import './styles.css';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  React.createElement(
    BrowserRouter,
    null,
    React.createElement(
      ToastProvider,
      null,
      React.createElement(
        UserMeasurementsProvider,
        null,
        React.createElement(App),
      ),
    ),
  ),
);

registerServiceWorker();
