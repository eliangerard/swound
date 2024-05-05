import { SongCard } from './components/SongCard'

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { Home } from './pages/Home'

const queryClient = new QueryClient()

function App() {



  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className='max-w-screen-lg w-full flex items-center justify-center'>
          <Home />

        </div>
      </QueryClientProvider>
    </>
  )
}

export default App
