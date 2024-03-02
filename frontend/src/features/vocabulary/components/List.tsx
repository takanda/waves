import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import styles from "../styles/List.module.css";
import { setIsVisibleVocabularies, fetchAsyncVocabulary, fetchAsyncVocabularyList } from '../../../redux/modules/vocabulary';

const List = () => {
  const entries = useAppSelector((state) => state.vocabulary.entries);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAsyncVocabularyList());
  }, [dispatch]);

  const handleUpdateClick = (entry: string) => {
    dispatch(fetchAsyncVocabulary(entry));
    dispatch(setIsVisibleVocabularies(false));
  };

  return (
    <>
      {entries.length > 0 ? (
        <div className={styles.vocabularies}>
          {entries.map(entry => (
            <div key={entry} className={styles.vocabulary}>
              <button aria-label={entry} onClick={() => handleUpdateClick(entry)}>{entry}</button>
            </div>
          ))}
        </div>
      ) : (
        <h3>データがありません</h3>
      )}
    </>
  )
}

export default List