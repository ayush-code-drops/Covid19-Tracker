import './App.css';
import {
  Select,
 MenuItem, 
 FormControl,
 Card,
 CardContent
} from '@mui/material'
import { useState } from 'react';
import { useEffect } from 'react';

import InfoBox from './InfoBox';
import Map from './Map'

//https://disease.sh/v3/covid-19/countries
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide")
  const [countryInfo,setCountryInfo]=useState({})
  
  useEffect(() => {
    const getCountries = async () => {
       await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json()).then((data) => {
        const countries=data.map((country) => (
          {
            name: country.country,
            value:country.countryInfo.iso2
            
          }
        ))
        setCountries(countries)
      })
    }

    getCountries()
  }, [])
  
  const handleCountryChange = async (e) => {
    const code = e.target.value;

    const url = code === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${code}`;
    

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(code)
      setCountryInfo(data)
    })
  }

 console.log("countryInfo",countryInfo);

  return (
    <div className="app">
      <div className="app__left">
          <div className="app__header">
        <h1>Covid Tracker</h1>
        <FormControl className="app__dropdown">
            <Select
            variant="outlined"
            value={country}
            onChange={handleCountryChange}
          >
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map((country) => <MenuItem value={country.value}>{country.name}</MenuItem>)
}
        </Select>
        </FormControl>
      
        </div>
        <div className="app__stats">
        <InfoBox title="Coronavirus Cases" total={countryInfo.cases} cases={3274}/>
        <InfoBox title="Recovered" total={countryInfo.recovered} cases={3221}/>
        <InfoBox title="Deaths" total={countryInfo.deaths} cases={5445}/>
        </div>
        <Map/>
      </div>
    
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By County</h3>

          <h3>Worldwide Live Cases</h3>
</CardContent>
      </Card>
     
      
    </div>
  );
}

export default App;
