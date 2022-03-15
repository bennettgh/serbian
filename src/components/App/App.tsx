import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { api, shuffle } from '../../utils';

type Words = {
  index: number,
  prompt: string,
  answer: string,
  solved: boolean
}[]


const transformAns = (ans: string) => ans.replace('đ', 'd')

const App = () => {
  const [words, setWords] = useState<Words>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [skipped, setSkipped] = useState(0);
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const fetchVerbs = async () => {
      const res = await api.fetchVerbs()
      console.log(res)

      const infinitives = Object.keys(res).map((infinitive: any) => ({ en: res[infinitive].translation, rs: infinitive }))
        // .slice(0, 3)
        .map((item, index) => ({ 
          index, 
          prompt: item.en.toLowerCase(), 
          answer: item.rs, 
          solved: false 
        })) as Words
        
      setWords(shuffle(infinitives))
    }
    fetchVerbs()
  }, [])

  useEffect(() => {
    // console.log(words[currentIdx]?.answer)
  }, [currentIdx, words])

  const checkAnswer = useCallback((guess) => {
    const answers = words[currentIdx].answer
    // multiple answers
    if (Array.isArray(answers)) {

      for (let ans of answers) {
      if (guess === ans || guess === transformAns(ans)) {
          return true
        }
      }
    } 
    // just one answer
    else {
      const ans = answers.toLowerCase()
      if (guess === ans || guess === transformAns(ans)) {
        return true
      }
    }

    return false

  }, [words, currentIdx])

  const handleChange = async (e: any) => {
    setInput(e.target.value)
    
    const guess = e.target.value.trim().toLowerCase()

    if (checkAnswer(guess)) {
      const newWords = [...words];
      newWords[currentIdx].solved = true
      setWords(newWords)
      setInput('')

      if (currentIdx === words.length - 1) {
        setGameOver(true)
      } else {
        await api.idk()
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
        {!gameOver ? words[currentIdx]?.prompt : "Game over!"}
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
