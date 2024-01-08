import React from "react";
import { useAppSelector, useAppDispatch } from "./redux/store/hooks";
import styles from "./App.module.css";
import { addPartsOfSpeechChecked, removePartsOfSpeechChecked } from "./redux/store/modules/parts_of_speech";


const App = () => {
  const partsOfSpeech = useAppSelector((state) => state.partsOfSpeech.partsOfSpeech);
  const partsOfSpeechChecked = useAppSelector((state) => state.partsOfSpeech.partsOfSpeechChecked);
  const dispatch = useAppDispatch();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, partOfSpeech: {
    ja: string;
    en: string;
  }) => {
    if (e.target.checked) {
      dispatch(addPartsOfSpeechChecked(partOfSpeech));
    } else {
      dispatch(removePartsOfSpeechChecked(partOfSpeech));
    }
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
          {partsOfSpeech.map((partOfSpeech, index) => (
            <div className={styles.sidebarPartOfSpeech} key={index}>
              <input id={`${partOfSpeech.en}-checkbox`} type="checkbox" aria-label={`${partOfSpeech.en}-checkbox`} onChange={(e) => handleCheckboxChange(e, partOfSpeech)} />
              <label htmlFor={`${partOfSpeech.en}-checkbox`}>{partOfSpeech.ja}</label>
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

          {partsOfSpeechChecked.map((partsOfSpeechChecked, index) => (
            <div className={styles.input} key={index}>
              <label htmlFor={`${partsOfSpeechChecked.en}-input`}>{partsOfSpeechChecked.ja}</label>
              <input id={`${partsOfSpeechChecked.en}-input`} type="text" />
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