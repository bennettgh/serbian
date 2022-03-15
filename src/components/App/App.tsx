import React, { useState, useEffect }  from 'react'
import { api, shuffle } from '../../utils'
import './App.css';
import { Game } from '../Game/Game'

async function fetchInfinitives() {
  const offset = 0;
  const limit = undefined;

  const verbs = await api.fetchVerbs()

  const infinitives = shuffle(Object.keys(verbs).slice(offset, limit))

  const data = infinitives.map(i => ({ 
    hint: verbs[i].translation, 
    answers: [i],
    solved: false,
    key: i 
  }));
  
  return data
}

const App = () => {
  const [questions, setQuestions] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      setQuestions(await fetchInfinitives())
    }
    fetchData()
  }, [])

  return (
    <div className="App bg-slate-100 pb-10">
      <h1 className='bg-slate-500 min-w-full px-10 py-2'><img src='https://www.jetpunk.com/img/logo-with-text.svg' alt="alt"/></h1>
      <Game initialData={questions}/>
    </div>
  );
}

export default App;
