import React from 'react'
import './Table.css'
function Table({countries}) {
  return (
      <div className="table">
          <tr>
              <th>Country's Name</th>
              <th>Confirmed</th>
              <th>Recovered</th>
              <th>Deaths</th>
          </tr>
          {countries.map(({ country, cases, recovered, deaths }) => {
              
              return (
                <tr>
                  <td>{country}</td>
                  <td><strong>{cases}</strong></td>
                  <td>{recovered }</td>
                  <td>{deaths}</td>
              </tr>  
              )
              
          } 
             )}
      </div>
  )
}

export default Table