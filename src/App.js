import './App.css';
import {
  Select,
 MenuItem, 
 FormControl,
 Card,
 CardContent,
} from '@mui/material'
import Table from "./Table"
import { useState } from 'react';
import { useEffect } from 'react';
import numeral from 'numeral'
import InfoBox from './InfoBox';

import { sortData,prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import { Line } from 'react-chartjs-2';

//https://disease.sh/v3/covid-19/countries
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide")
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType,setCasesType]=useState('cases')
  
  
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
      setCountryInfo(data)
    })
  },[])
  useEffect(() => {
    const getCountries = async () => {
       await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json()).then((data) => {
        const countries=data.map((country) => (
          {
            name: country.country,
            value:country.countryInfo.iso2
            
          }
        ))
         const sortedData=sortData(data)
         setTableData(sortedData)
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
        <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <h2>Worldwide new cases</h2>
            <LineGraph casesType="cases" />
      </div>
    
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By County</h3>
<Table countries={tableData}/>

</CardContent>
      </Card>
     
      
    </div>
  );
}

export default App;
