import React from 'react';
import { AlertTriangle } from 'lucide-react';

// Without this, any uncaught render error unmounts the whole React tree and leaves
// a blank page with no way to recover except a manual reload.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24, textAlign: 'center', fontFamily: "'Inter',sans-serif", color: '#6d766c' }}>
          <AlertTriangle size={32} color="#d64545" />
          <span style={{ maxWidth: 420 }}>Something went wrong showing this page. Your data is safe — reloading usually fixes it.</span>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
            style={{ padding: '10px 22px', borderRadius: 10, border: 0, background: '#14532d', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
