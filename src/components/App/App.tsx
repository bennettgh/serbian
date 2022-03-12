import React, { useState } from 'react';
import './App.css';
import { getInfinitives, shuffle } from '../../utils';
import wordsJSON from '../../data/verbs.json'

type Words = {
  index: number,
  prompt: string,
  answer: string,
  solved: boolean
}[]


const allData: any = wordsJSON

const data = shuffle(
    getInfinitives(wordsJSON)
      .map(infinitive => ({ en: allData[infinitive].translation, rs: infinitive }))
      .slice(20, 40)
  )
  .map((item, index) => ({ 
    index, 
    prompt: item.en.toLowerCase(), 
    answer: item.rs, 
    solved: false 
  })) as Words


const transformAns = (ans: string) => ans.replace('đ', 'd')

const App = () => {
  const [words, setWords] = useState<Words>(data);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [skipped, setSkipped] = useState(0);
  const [gameOver, setGameOver] = useState(false)

  const handleChange = (e: any) => {
    setInput(e.target.value)
    
    const ans = words[currentIdx].answer.toLowerCase()
    const guess = e.target.value.trim().toLowerCase()
    console.log("hello", ans, e.target.value.trim().toLowerCase())

    if (guess === ans || guess === transformAns(ans)) {
      const newWords = [...words];
      newWords[currentIdx].solved = true
      setWords(newWords)
      setInput('')

      if (currentIdx === words.length - 1) {
        setGameOver(true)
      } else {
        setCurrentIdx(currentIdx+1)
      }
    }
    
  }

  const handleClick = () => {
    setWords(words.map(word => ({ ...word, solved: true })))
  }

  const handleReset = () => {
    setWords(shuffle(words.map(word => ({ ...word, solved: false }))))
    setSkipped(0)
    setCurrentIdx(0)
    setGameOver(false)
  }

  const handleSkip = () => {
    setSkipped(skipped + 1)
    setCurrentIdx(currentIdx+1)
  }

  return (
    <div className="App bg-slate-100 pb-10">
      <h1 className='bg-slate-500 min-w-full px-10 py-2'><img src='https://www.jetpunk.com/img/logo-with-text.svg' alt="alt"/></h1>
      <div className=' mt-20 text-xl'>
        {words.reduce((acc:any, curr: any) => curr.solved ? acc+1 : acc, 0 )} / {words.length} guessed
      </div>
      <h1 className='text-4xl my-4'>
        {!gameOver ? words[currentIdx].prompt : "Game over!"}
      </h1>
      <input value={input} onChange={handleChange} className='my-4 px-2 py-1 mx-4 rounded-md' />

      <br></br>
      <br></br>


      <div className='my-1 text-xs'>
        {skipped} skipped, {words.length - skipped - words.filter(word => word.solved).length} to go
      </div>
      <button className='mx-1 text-xs' onClick={handleReset}>reset</button>{' '}
      <button className='mx-1 text-xs' onClick={handleSkip}>skip</button>{' '}
      <button className='mx-1 text-xs' onClick={handleClick}>give up</button>
    </div>
  );
}

export default App;
