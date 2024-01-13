import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./redux/store/hooks";
import styles from "./App.module.css";
import { addPartsOfSpeechChecked, removePartsOfSpeechChecked, fetchAsyncPartOfSpeech } from "./redux/store/modules/parts_of_speech";


const App = () => {
  const partsOfSpeech = useAppSelector((state) => state.partsOfSpeech.partsOfSpeech);
  const partsOfSpeechChecked = useAppSelector((state) => state.partsOfSpeech.partsOfSpeechChecked);
  const isLoading = useAppSelector((state) => state.partsOfSpeech.isLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAsyncPartOfSpeech())
  }, [dispatch])

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, partOfSpeech: {
    id: number
    ja_name: string;
    en_name: string;
  }) => {
    if (e.target.checked) {
      dispatch(addPartsOfSpeechChecked(partOfSpeech));
    } else {
      dispatch(removePartsOfSpeechChecked(partOfSpeech));
    }
  }

  if (isLoading) {
    return <></>;
  }
  return (
    <div className={styles.app}>
      <div className={styles.sidebar}>
        <div>
          <p className={styles.sidebarTitle}>アクション</p>
          <div className={styles.links}>
            <a href="#">・データ登録</a>
            <a href="#">・データ一覧</a>
            <a href="#">・データ検索</a>
          </div>
        </div>

        <div className={styles.sidebarPartsOfSpeech}>
          <div className={styles.sidebarTitle}>
            品詞
          </div>
          {partsOfSpeech.map(partOfSpeech => (
            <div className={styles.sidebarPartOfSpeech} key={partOfSpeech.id}>
              <input id={`${partOfSpeech.id}-checkbox`} type="checkbox" aria-label={`${partOfSpeech.id}-checkbox`} onChange={(e) => handleCheckboxChange(e, partOfSpeech)} />
              <label htmlFor={`${partOfSpeech.id}-checkbox`}>{partOfSpeech.ja_name}</label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.content}>
          <h1>Vocabulary DB</h1>
          <div className={styles.input}>
            <label htmlFor="english-word-input">英単語/フレーズ</label>
            <input id="english-word-input" type="text" />
          </div>

          {partsOfSpeechChecked.map(partOfSpeechChecked => (
            <div className={styles.input} key={partOfSpeechChecked.id}>
              <label htmlFor={`${partOfSpeechChecked.id}-input`}>{partOfSpeechChecked.ja_name}</label>
              <input id={`${partOfSpeechChecked.id}-input`} type="text" />
            </div>
          ))}

        </div>

      </div>
      <div className={styles.footer}>
        <button>保存</button>
      </div>
    </div>
  );
};
export default App