import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {auth} from './firebase/firebase'
import AuthProvider from './store/AuthProvider'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ScrollToTop from './common/ScrollToTop'


console.log(auth)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <RecoilRoot>
    <AuthProvider>
      <BrowserRouter> 
        <QueryClientProvider client={queryClient}>
          <ScrollToTop />
          <App />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </BrowserRouter>
    </AuthProvider>
  </RecoilRoot>
  // </React.StrictMode>,
)
