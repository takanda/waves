import React from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import { setEditingPosList } from '../../../redux/modules/vocabulary';
import PartOfSpeechCheckBox from './PartOfSpeechCheckBox';
import styles from '../styles/Sidebar.module.css'


const Sidebar = () => {
  const partsOfSpeech = useAppSelector(state => state.partsOfSpeech.partsOfSpeech);
  const editingPosList = useAppSelector(state => state.vocabulary.editingPosList);
  const isSearch = useAppSelector(state => state.vocabulary.isSearch);
  const isVisibleVocabularies = useAppSelector(state => state.vocabulary.isVisibleVocabularies);
  const isQuiz = useAppSelector(state => state.quiz.isQuiz);
  const dispatch = useAppDispatch();
  const handleCheckboxChange = (partOfSpeech: {
    id: number
    ja_name: string;
    en_name: string;
  }) => {
    dispatch(setEditingPosList(partOfSpeech.id));
  };

  if (isVisibleVocabularies || isSearch || isQuiz) {
    return <></>;
  }
  return (
    <div className={styles.posContainer}>
      <div className={styles.posTitle}>
        品詞
      </div>
      {partsOfSpeech.map(partOfSpeech => (
        <PartOfSpeechCheckBox key={partOfSpeech.id} partOfSpeech={partOfSpeech} editingPosList={editingPosList} handleCheckboxChange={handleCheckboxChange} />
      ))}
    </div>
  )
}

export default Sidebar