import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../redux/store/hooks';
import styles from "./List.module.css";
import { Vocabulary, setShowVocabularyList, fetchAsyncVocabulary, fetchAsyncVocabularyList } from '../redux/modules/vocabulary';


const List = () => {
  const vocabularyList = useAppSelector((state) => state.vocabulary.vocabularyList);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAsyncVocabularyList());
  }, [dispatch]);

  const handleUpdateClick = (vocabulary: Vocabulary) => {
    dispatch(fetchAsyncVocabulary(vocabulary.search_text));
    dispatch(setShowVocabularyList(false));
  };

  return (
    <div className={styles.main}>
            <div className={styles.content}>
                <h1>Vocabulary DB</h1>
                {vocabularyList.length > 0 ? (
                  <>
                    {vocabularyList.map(vocabulary => (
                      <h3 key={vocabulary.id} onClick={() => handleUpdateClick(vocabulary)}>{vocabulary.show_text}</h3>
                    ))}
                  </>
                ) : (
                  <h3>データがありません</h3>
                )}
            </div>
        </div>
  )
}

export default List