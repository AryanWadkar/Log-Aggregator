import './App.css';
import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import EntriesSection from './components/entry'
import GraphsSection from './components/graph';

function App() {
  const [activeSection, setActiveSection] = useState('entries');
  const [entries, setEntries] = useState([]);
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError,setHasError] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setHasError(false);
    let docs=[];
    let mappings=[];
    try{
      await fetch('getall').then(response=>response.json()).then(data=>docs=data.data);
      await fetch('mappings').then(response=>response.json()).then(data=>mappings=data.data);
    }catch(err){
      console.log("error caught"+err);
      setHasError(true);
    }
    setEntries(docs);
    setFields(mappings);
    setIsLoading(false);
  };

  const search = async(query,size)=>{
    if(Object.keys(query).length!==0)
    {
      let docs=[];
      setIsLoading(true);
      setHasError(false);
      await fetch('search', {
        method: 'POST',
        body: JSON.stringify({
          query:query,
          size:size
        }),
        headers: {
          'Content-type': 'application/json',
          'Accept':'*/*'
        },
      })
         .then((response) => response.json())
         .then((data) => 
          docs=data.data
         )
         .catch((err) => {
          setHasError(true);
         });
      setIsLoading(false);
      setEntries(docs);
    }
  }

  useEffect(() => {fetchData();}, []);

  return (
    <div className="App">
      <Navbar setActiveSection={setActiveSection} onReload={fetchData} currActive={activeSection} />
      {activeSection === 'entries' && <EntriesSection entries={entries} isLoading={isLoading} fields={fields} err={hasError} makeSearch={search}/>}
      {activeSection === 'graphs' && <GraphsSection entries={entries} isLoading={isLoading} err={hasError}/>}
    </div>
  );
}

export default App;
