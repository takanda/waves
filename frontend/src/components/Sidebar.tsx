import React from 'react'
import { useAppSelector, useAppDispatch } from "../redux/store/hooks";
import styles from "./Sidebar.module.css";
import { setIsChecked } from "../redux/modules/parts_of_speech";
import { addEditingPosList, removeEditingPosList } from '../redux/modules/vocabulary';


const Sidebar = () => {
  const partsOfSpeech = useAppSelector((state) => state.partsOfSpeech.partsOfSpeech);
  const isChecked = useAppSelector((state) => state.partsOfSpeech.isChecked);
  const dispatch = useAppDispatch();
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, partOfSpeech: {
    id: number
    ja_name: string;
    en_name: string;
  }) => {
    dispatch(setIsChecked(partOfSpeech.id));
    if (e.target.checked) {
      dispatch(addEditingPosList(partOfSpeech.id));
    } else {
      dispatch(removeEditingPosList(partOfSpeech.id));
    }
  }

  return (
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
            <input 
              id={`${partOfSpeech.id}-checkbox`}
              type="checkbox"
              aria-label={`${partOfSpeech.id}-checkbox`}
              checked={isChecked.includes(partOfSpeech.id) ? true : false}
              onChange={(e) => handleCheckboxChange(e, partOfSpeech)} 
            />
            <label htmlFor={`${partOfSpeech.id}-checkbox`}>{partOfSpeech.ja_name}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar