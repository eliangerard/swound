import { SongCard } from './components/SongCard'

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { Home } from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Callback } from './middlewares/Callback'

const queryClient = new QueryClient()

function App() {



  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className='max-w-screen-lg w-full flex items-center justify-center'>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/callback' element={<Callback/>}/>
            </Routes>
          </BrowserRouter>
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App
