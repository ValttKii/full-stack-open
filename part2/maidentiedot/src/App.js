import { useState, useEffect } from 'react'
import countryService from './services/countries'




const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    countryService
      .getAll()
      .then(res => {
        setCountries(res)
        console.log("P", res)
      })
  }, [])
  

  return(
    <div>
      
      <p>no matches</p>
    </div>
  )
}

export default App;
