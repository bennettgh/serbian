import React, { useState } from 'react';
import './App.css';
import { getInfinitives } from '../../utils';

import wordsJSON from '../../data/verbs.json'

type Words = {
  index: number,
  prompt: string,
  answer: string,
  solved: boolean
}[]


const allData: any = wordsJSON

const data = getInfinitives(wordsJSON).map(infinitive => ({ en: allData[infinitive].translation, rs: infinitive }))
  .map((item, index) => ({ 
    index, 
    prompt: item.en.toLowerCase(), 
    answer: item.rs, 
    solved: false 
  })) as Words

const Answer = ({ show, text }: { show: boolean, text: string}) => {
  const [reveal, setReveal] = useState(false)

  return (
    <div 
      className='border-2 border-slate-200 h-8 min-h-full bg-white'
      onMouseEnter={() => setReveal(true)}
      onMouseLeave={() => setReveal(false)}
    >
      {(show || reveal) && text}
    </div>
  )
}

const Prompt = ({ cross, text }: { cross: boolean, text: string}) => {
  return (
    <div className='border-2 border-slate-200	h-8 min-h-full bg-white'>
      <span className={`${cross && 'line-through'}`}>{text}</span>
    </div>
  )
}

const App = () => {
  const [words, setWords] = useState<Words>(data)
  const [input, setInput] = useState('')

  const handleChange = (e: any) => {
    setInput(e.target.value)

    while (true) {
      const foundIndex = words.findIndex(word => word.answer.toLowerCase() === e.target.value.trim().toLowerCase() && word.solved === false)

      if (!(foundIndex >= 0)) break

      const newWords = [...words]
      newWords[foundIndex].solved = true
      setWords(newWords)
      setInput('')
    }
  }

  const handleClick = () => {
    setWords(words.map(word => ({ ...word, solved: true })))
  }

  const handleReset = () => {
    setWords(words.map(word => ({ ...word, solved: false })))
  }

  return (
    <div className="App bg-slate-100">
      <h1 className='bg-slate-500 min-w-full px-10 py-2'><img src='https://www.jetpunk.com/img/logo-with-text.svg' /></h1>
      <button onClick={handleReset}>reset</button>
      <input value={input} onChange={handleChange} className='mt-10 px-2 py-1 mx-4 rounded-md' />
      <button onClick={handleClick}>give up</button>
      <div className='my-4'>
        {words.reduce((acc:any, curr: any) => curr.solved ? acc+1 : acc, 0 )} / {words.length} guessed
      </div>
      <div className='grid-rows-2'>
        <div className='top border-2 grid grid-cols-5 p-10'>
          {words.map(el => <Prompt key={el.index} cross={el.solved} text={el.prompt} />)}
        </div>
        <div className='bottom grid grid-cols-5 p-10'>
          {words.map(el => <Answer key={el.index} show={el.solved} text={el.answer} />)}
        </div>
      </div>
    </div>
  );
}

export default App;
