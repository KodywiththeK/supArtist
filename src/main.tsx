import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {auth} from './firebase/firebase'
import AuthProvider from './store/AuthProvider'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'

console.log(auth)
const queryClient = new QueryClient

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <RecoilRoot>
    <AuthProvider>
      <BrowserRouter> 
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </BrowserRouter>
    </AuthProvider>
  </RecoilRoot>
  // </React.StrictMode>,
)
