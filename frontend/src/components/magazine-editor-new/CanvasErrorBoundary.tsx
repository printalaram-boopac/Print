import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface CanvasErrorBoundaryProps {
  children: ReactNode;
  resetKey: string | number;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

/** Isolates a single page's canvas render — if one page's content throws,
 * the rest of the editor (other pages, panels, toolbar) keeps working
 * (Step 7 §70). `resetKey` (the page id) re-mounts the boundary when the
 * user switches pages or retries. */
export default class CanvasErrorBoundary extends Component<CanvasErrorBoundaryProps, CanvasErrorBoundaryState> {
  state: CanvasErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: CanvasErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 w-[480px] aspect-[210/297] bg-[#F5F5F3] rounded-sm border border-[#E7E7E4]">
          <AlertTriangle className="w-6 h-6 text-[#6F7478]" strokeWidth={1.75} />
          <p className="text-[13px] text-[#6F7478]">Couldn't load this page.</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-white transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
