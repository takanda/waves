import React from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import styles from "../styles/Sidebar.module.css";
import { setEditingPosList, setSearchEntry, setIsUpdate, setIsVisibleVocabularies, setEntry, clearInputMeanings, fetchAsyncVocabulary, clearEditingPosList } from '../../../redux/modules/vocabulary';
import PartOfSpeechCheckBox from './PartOfSpeechCheckBox';


const Sidebar = () => {
  const partsOfSpeech = useAppSelector(state => state.partsOfSpeech.partsOfSpeech);
  const editingPosList = useAppSelector(state => state.vocabulary.editingPosList);
  const searchEntry = useAppSelector(state => state.vocabulary.searchEntry);
  const validationResult = useAppSelector(state => state.vocabulary.validationResult);
  const dispatch = useAppDispatch();
  const handleCheckboxChange = (partOfSpeech: {
    id: number
    ja_name: string;
    en_name: string;
  }) => {
    dispatch(setEditingPosList(partOfSpeech.id));
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (searchEntry) {
      dispatch(fetchAsyncVocabulary(searchEntry.replace(/\s/g, "").toLowerCase()));
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(setSearchEntry(e.target.value));
  };

  const handleInsertButtonClick = () => {
    dispatch(setIsUpdate(false));
    dispatch(setIsVisibleVocabularies(false));
    dispatch(clearEditingPosList());
    dispatch(setEntry(""));
    dispatch(clearInputMeanings());
  };

  const handleFetchListButtonClick = () => {
    dispatch(setIsUpdate(false));
    dispatch(setIsVisibleVocabularies(true));
    dispatch(clearEditingPosList());
  };

  return (
    <div className={styles.sidebar}>
      <button
        className={styles.sidebarTitle}
        onClick={handleInsertButtonClick}
        aria-label='insert-vocabulary-button'
      >データ登録</button>
      <br/>
      <button
        className={styles.sidebarTitle}
        aria-label='show-list-button'
        onClick={handleFetchListButtonClick}
      >データ一覧</button>
      <div className={styles.sidebarSearchInput}>
        <form onSubmit={submitHandler}>
          <label htmlFor='search-vocabulary' className={styles.sidebarTitle}>データ検索</label>
          <input
            id='search-vocabulary'
            type="text"
            placeholder='英単語/フレーズを検索'
            value={searchEntry}
            aria-label='search-vocabulary'
            onChange={handleInputChange}
          />
          {validationResult.errorMessage.searchEntry && <p className={styles.errorMessage}>{validationResult.errorMessage.searchEntry}</p>}
        </form>
      </div>

      <div>
        <div className={styles.sidebarTitle}>
          品詞
        </div>
        <div className={styles.sidebarPartsOfSpeech}>
          {partsOfSpeech.map(partOfSpeech => (
            <PartOfSpeechCheckBox key={partOfSpeech.id} partOfSpeech={partOfSpeech} editingPosList={editingPosList} handleCheckboxChange={handleCheckboxChange} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar