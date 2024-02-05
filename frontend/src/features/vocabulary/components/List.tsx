import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import styles from "../styles/List.module.css";
import { setIsVisibleVocabularies, fetchAsyncVocabulary, fetchAsyncVocabularyList } from '../../../redux/modules/vocabulary';

const List = () => {
  const vocabularies = useAppSelector((state) => state.vocabulary.vocabularies);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAsyncVocabularyList());
  }, [dispatch]);

  const handleUpdateClick = (showText: string) => {
    dispatch(fetchAsyncVocabulary(showText.replace(/\s/g, "").toLowerCase()));
    dispatch(setIsVisibleVocabularies(false));
  };

  return (
    <>
      {vocabularies.length > 0 ? (
        <div className={styles.vocabularies}>
          {vocabularies.map(vocabulary => (
            <div key={vocabulary} className={styles.vocabulary}>
              <button aria-label={vocabulary} onClick={() => handleUpdateClick(vocabulary)}>{vocabulary}</button>
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