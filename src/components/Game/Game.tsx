import React, { useEffect, useState } from 'react';
import { api, sanitizeAnswer } from '../../utils';

type Question = {
  hint: string,
  answers: string[],
  solved: boolean,
  key: string
}

export const Game = ({ initialData }: { initialData: Question[] }) => {
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState<any>(initialData)
  const [input, setInput] = useState('');
  const [skipped, setSkipped] = useState(0);
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => setQuestions(initialData), [initialData])

  const checkGuess = async (guess: string) => {
    const sanitizedGuess = guess.trim().toLowerCase()
    const answers = questions[index].answers;

    for (let answer of answers) {
      if (sanitizedGuess === sanitizeAnswer(answer)) {
        await api.postEvent(questions[index].key, true)
        const newQuestions = [...questions];
        newQuestions[index].solved = true
        setInput('')
        setQuestions(newQuestions)
        setIndex(index + 1)
      } 
    }
  }

  useEffect(() => {
    if (index === questions.length - 1) {
      setGameOver(true)
    }
  }, [index, questions.length])

  useEffect(() => {
    if (!questions[index]?.solved) {
      console.log(questions[index]?.answers)
    }
  }, [questions, index])

  const handleInputChange = (e: any) => {
    setInput(e.target.value)
    checkGuess(e.target.value);
  }

  const handleStartOver = () => {
    setInput('')
    setQuestions(questions.map((q: Question) => ({ ...q, solved: false })))
    setIndex(0)
  }

  const handleSkipQuestion = async () => {
    await api.postEvent(questions[index].key, false)
    setSkipped(skipped + 1)
    setIndex(index + 1)
  }

  const handleGiveUp = () => {
    setGameOver(true)
  }

  return (
    <>
      <div className='mt-20 text-xl'>
        {questions.reduce((acc: any, curr: any) => curr.solved ? acc + 1 : acc, 0)} / {questions.length} guessed
      </div>
      {
        gameOver && <h1 className='text-4xl my-4'>Game Over!</h1>
      }
      {
        !gameOver && <>
          <h1 className='text-4xl my-4'>{questions[index]?.hint}</h1>
          <input value={input} onChange={handleInputChange} className='my-4 px-2 py-1 mx-4 rounded-md' />
          <br></br>
          <br></br>
          <div className='my-1 text-xs'>
            {skipped} skipped, {questions.length - skipped - questions.filter((q: Question) => q.solved).length} to go
          </div>
          <button className='mx-1 text-xs' onClick={handleStartOver}>reset</button>{' '}
          <button className='mx-1 text-xs' onClick={handleSkipQuestion}>skip</button>{' '}
          <button className='mx-1 text-xs' onClick={handleGiveUp}>give up</button>
        </>
      }
    </>
  );
}
