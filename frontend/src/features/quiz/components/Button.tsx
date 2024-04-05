import React from 'react'
import styles from '../styles/Button.module.css'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks'
import { setIsStart, addCurrentIndex, setShowAnswer, updateDictionaryEntries, fetchAsyncQuizList, postAsyncQuiz, updateQuizResults, updateFailureQuizzes } from '../../../redux/modules/quiz'



const Button = () => {
  const dictionaryEntries = useAppSelector(state => state.quiz.dictionaryEntries);
  const currentIndex = useAppSelector(state => state.quiz.currentIndex);
  const isStart = useAppSelector(state => state.quiz.isStart);
  const showAnswer = useAppSelector(state => state.quiz.showAnswer);
  const quizResults = useAppSelector(state => state.quiz.quizResults);
  const dispatch = useAppDispatch();

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(setIsStart(true));
    dispatch(fetchAsyncQuizList());
  };

  const handleBtnClick = (result: string) => {
    dispatch(updateQuizResults({ entry: dictionaryEntries[currentIndex].entry, result: result }));
    if (result === "failure") {
      dispatch(updateDictionaryEntries(currentIndex));
      dispatch(updateFailureQuizzes(dictionaryEntries[currentIndex].entry));
    }
    dispatch(addCurrentIndex());
    if (result !== "failure" && currentIndex === dictionaryEntries.length - 1) {
      dispatch(postAsyncQuiz(quizResults));
    }
    dispatch(setShowAnswer());
  };

  if (isStart && !dictionaryEntries.length) {
    return <></>;
  }
  return (
    <div className={styles.btnContainer}>
      {
        isStart ? (
          <>
            <button onClick={() => { handleBtnClick("perfect") }} disabled={showAnswer.includes(false)}>完璧</button>
            <button onClick={() => { handleBtnClick("pass") }} disabled={showAnswer.includes(false)}>正解</button>
            <button onClick={() => { handleBtnClick("failure") }} disabled={showAnswer.includes(false)}>もう一度</button>
          </>
        ) : (
          <button onClick={clickHandler}>はじめる</button>
        )}
    </div >
  )
}

export default Button