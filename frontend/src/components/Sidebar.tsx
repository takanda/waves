import React from 'react'
import { useAppSelector, useAppDispatch } from '../redux/store/hooks'
import { setIsUpdate, setIsSearch, setIsVisibleVocabularies, setEntry, clearInputMeanings, clearEditingPosList, clearValidationError } from '../redux/modules/vocabulary'
import { setIsStart, setIsQuiz, clearQuizResults, clearFailureQuizzes, clearCurrentIndex, clearDictionaryEntries } from '../redux/modules/quiz'
import VocabularySidebar from '../features/vocabulary/components/Sidebar'
import styles from '../styles/Sidebar.module.css'


const Sidebar = () => {
  const isQuiz = useAppSelector((state) => state.quiz.isQuiz);
  const dispatch = useAppDispatch();

  const handleInsertButtonClick = () => {
    dispatch(setIsUpdate(false));
    dispatch(setIsSearch(false));
    dispatch(setIsVisibleVocabularies(false));
    dispatch(clearEditingPosList());
    dispatch(setEntry(""));
    dispatch(clearInputMeanings());
    dispatch(clearValidationError());
  };

  const handleFetchListButtonClick = () => {
    dispatch(setIsUpdate(false));
    dispatch(setIsSearch(false));
    dispatch(setIsVisibleVocabularies(true));
    dispatch(clearEditingPosList());
    dispatch(clearValidationError());
  };

  const handleFetchButtonClick = () => {
    dispatch(setIsUpdate(false));
    dispatch(setIsVisibleVocabularies(false));
    dispatch(clearEditingPosList());
    dispatch(setEntry(""));
    dispatch(clearInputMeanings());
    dispatch(setIsSearch(true));
    dispatch(clearValidationError());
  };

  const handleReturnBtnClick = () => {
    dispatch(setIsQuiz(false));
    dispatch(setIsStart(false));
    dispatch(clearQuizResults());
    dispatch(clearFailureQuizzes());
    dispatch(clearCurrentIndex());
    dispatch(clearDictionaryEntries());
  };

  if (isQuiz) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.quizBtnContainer}>
          <div className={styles.quitBtnContainer}>
            <button onClick={handleReturnBtnClick}>戻る</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.quizBtnContainer}>
        <button onClick={() => dispatch(setIsQuiz(true))}>Quiz</button>
      </div>
      <div className={styles.sidebarBtnContainer}>
        <button onClick={handleInsertButtonClick} aria-label='insert-vocabulary-button'>
          データ登録
        </button>
      </div>
      <div className={styles.sidebarBtnContainer}>
        <button aria-label='show-list-button' onClick={handleFetchListButtonClick}>
          データ一覧
        </button>
      </div>
      <div className={styles.sidebarBtnContainer}>
        <button aria-label='show-list-button' onClick={handleFetchButtonClick}>
          データ検索
        </button>
      </div>
      <VocabularySidebar />
    </div>
  )
}

export default Sidebar