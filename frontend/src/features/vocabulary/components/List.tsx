import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import styles from "../styles/List.module.css";
import { setIsVisibleShowTextList, fetchAsyncVocabulary, fetchAsyncVocabularyList } from '../../../redux/modules/vocabulary';

const List = () => {
  const showTextList = useAppSelector((state) => state.vocabulary.showTextList);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAsyncVocabularyList());
  }, [dispatch]);

  const handleUpdateClick = (showText: string) => {
    dispatch(fetchAsyncVocabulary(showText.replace(/\s/g, "").toLowerCase()));
    dispatch(setIsVisibleShowTextList(false));
  };

  return (
    <>
      {showTextList.length > 0 ? (
        <div className={styles.showTextList}>
          {showTextList.map(showText => (
            <div key={showText} className={styles.showText}>
              <button aria-label={showText} onClick={() => handleUpdateClick(showText)}>{showText}</button>
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