
import { ThemeProvider } from "@/context/theme-provider"
import Layout from "./components/layout"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import WeatherDashboard from "./Pages/weather-dashboard"
import CityPages from "./Pages/city-pages"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000, //not recieving data before accessed
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
  
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark">
          <Layout>
            <Routes>
              <Route path='/' element={<WeatherDashboard/>}/>
              <Route path='/city/:cityName' element={<CityPages/>}/>
            </Routes>
          </Layout>
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>    
  )
}

export default App