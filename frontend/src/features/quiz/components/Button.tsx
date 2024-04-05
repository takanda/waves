import React from 'react'
import styles from '../styles/Button.module.css'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks'
import { setIsQuiz, setIsStart, clearQuizResults, clearFailureQuizzes, clearDictionaryEntries, clearCurrentIndex, addCurrentIndex, setShowAnswer, updateDictionaryEntries, fetchAsyncQuizList, postAsyncQuiz, updateQuizResults, updateFailureQuizzes } from '../../../redux/modules/quiz'



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
    const quizResult = { entry: dictionaryEntries[currentIndex].entry, result: result };
    dispatch(updateQuizResults(quizResult));
    if (result === "failure") {
      dispatch(updateDictionaryEntries(currentIndex));
      dispatch(updateFailureQuizzes(dictionaryEntries[currentIndex].entry));
    }
    dispatch(addCurrentIndex());
    dispatch(setShowAnswer());
  };

  const clickSubmitBtnHandler = () => {
    dispatch(postAsyncQuiz(quizResults));
    dispatch(setIsQuiz(false));
    dispatch(setIsStart(false));
    dispatch(clearQuizResults());
    dispatch(clearFailureQuizzes());
    dispatch(clearCurrentIndex());
    dispatch(clearDictionaryEntries());
  };
  if (isStart && !dictionaryEntries.length) {
    return <></>;
  }

  if (dictionaryEntries.length && currentIndex >= dictionaryEntries.length) {
    return (
      <div className={styles.btnContainer}>
        <button onClick={clickSubmitBtnHandler}>送信</button>
      </div >
    );
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