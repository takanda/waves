import React from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import styles from "../styles/Sidebar.module.css";
import { setEditingPosList, updateSearchText, setIsUpdate, setIsVisibleShowTextList, updateInputEnglish, clearInputMeanings, fetchAsyncVocabulary, clearEditingPosList } from '../../../redux/modules/vocabulary';


const Sidebar = () => {
  const partsOfSpeech = useAppSelector(state => state.partsOfSpeech.partsOfSpeech);
  const editingPosList = useAppSelector(state => state.vocabulary.editingPosList);
  const searchText = useAppSelector(state => state.vocabulary.searchText);
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
    if (searchText) {
      dispatch(fetchAsyncVocabulary(searchText.replace(/\s/g, "").toLowerCase()));
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(updateSearchText(e.target.value));
  };

  const handleInsertButtonClick = () => {
    dispatch(setIsUpdate(false));
    dispatch(setIsVisibleShowTextList(false));
    dispatch(clearEditingPosList());
    dispatch(updateInputEnglish(""));
    dispatch(clearInputMeanings());
  };

  const handleFetchListButtonClick = () => {
    dispatch(setIsUpdate(false));
    dispatch(setIsVisibleShowTextList(true));
    dispatch(clearEditingPosList());
  };

  return (
    <div className={styles.sidebar}>
      <button
        className={styles.sidebarTitle}
        onClick={handleInsertButtonClick}
        aria-label='insert-vocabulary-button'
      >データ登録</button>
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
            value={searchText}
            aria-label='search-vocabulary'
            onChange={handleInputChange}
          />
        </form>
      </div>

      <div>
        <div className={styles.sidebarTitle}>
          品詞
        </div>
        <div className={styles.sidebarPartsOfSpeech}>
          {partsOfSpeech.map(partOfSpeech => (
            <div key={partOfSpeech.id}>
              <input
                id={`${partOfSpeech.id}-checkbox`}
                type="checkbox"
                aria-label={`${partOfSpeech.id}-checkbox`}
                checked={editingPosList.includes(partOfSpeech.id) ? true : false}
                onChange={() => handleCheckboxChange(partOfSpeech)}
              />
              <label htmlFor={`${partOfSpeech.id}-checkbox`}>{partOfSpeech.ja_name}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar