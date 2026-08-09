import { Component, type ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Uncaught React UI error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 text-zinc-900">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Something went wrong</h2>
            <p className="text-xs text-zinc-600">
              The application encountered a temporary issue. Please refresh or return to the home page.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.href = '/'
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Back to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
