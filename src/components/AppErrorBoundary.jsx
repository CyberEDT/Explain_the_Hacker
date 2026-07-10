import { Component } from 'react';

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[AppErrorBoundary]', error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const errorLabel = error?.name || 'RuntimeError';
    const errorMessage = error?.message || 'Unknown application error';

    return (
      <main className="app-fallback-screen" role="alert">
        <div className="app-fallback-panel">
          <p className="app-fallback-kicker">ETH PLATFORM</p>
          <h1>Something blocked the app from loading.</h1>
          <p>
            Refresh the page. If this keeps happening, check the browser console
            for the first error shown.
          </p>
          <pre className="app-fallback-error">
            {errorLabel}: {errorMessage}
          </pre>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      </main>
    );
  }
}
