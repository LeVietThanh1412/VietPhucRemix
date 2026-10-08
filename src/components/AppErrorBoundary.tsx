import React from 'react';

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="min-h-screen flex items-center justify-center p-6 bg-[#FAF7F2]">
      <div role="alert" className="text-center space-y-4">
        <p className="text-stone-800">Không tải được giao diện. Hãy tải lại trang để thử lại.</p>
        <button className="px-4 py-2 rounded-lg bg-stone-900 text-white" onClick={() => window.location.reload()}>Tải lại trang</button>
      </div>
    </main>;
  }
}
