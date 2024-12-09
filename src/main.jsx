import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PrivyProvider } from '@privy-io/react-auth'
import vite from '../public/vite.svg'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_APP_ID || "your-privy-app-id"}
      config={{
        // Display email as login methods
        loginMethods: ['email'],
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: '/vite.svg'
        },
        // Create embedded wallets for all users
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>,
)
