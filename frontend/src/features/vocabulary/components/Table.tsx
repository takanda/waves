import React from 'react'
import styles from "../styles/Table.module.css";
import { useAppDispatch } from '../../../redux/store/hooks';
import { DictionaryEntry } from '../../../redux/modules/vocabulary';
import { setIsVisibleVocabularies, fetchAsyncVocabulary, setAscOrder, setDescOrder, OrderTarget } from '../../../redux/modules/vocabulary';
import { FaSortUp, FaSortDown } from "react-icons/fa6";

const Table = ({ currentDictionaryEntries }: { currentDictionaryEntries: DictionaryEntry[] }) => {
    const dispatch = useAppDispatch();
    const handleUpdateClick = (entry: string) => {
        dispatch(fetchAsyncVocabulary(entry));
        dispatch(setIsVisibleVocabularies(false));
    };
    const handleAscButtonClick = (target: OrderTarget) => {
        dispatch(setAscOrder(target));
    };
    const handleDescButtonClick = (target: OrderTarget) => {
        dispatch(setDescOrder(target));
    };

    return (
        <div className={styles.vocabularies}>
            <table>
                <thead>
                    <tr>
                        <th className={`${styles.column} ${styles.entryColumn}`}>
                            単語/フレーズ
                            <button className={styles.ascBtn} onClick={() => handleAscButtonClick("entry")}><FaSortUp className={styles.ascIcon}/></button>
                            <button className={styles.descBtn} onClick={() => handleDescButtonClick("entry")}><FaSortDown className={styles.descIcon}/></button>
                        </th>
                        <th className={styles.column}>
                            作成日時
                            <button className={styles.ascBtn} onClick={() => handleAscButtonClick("created_at")}><FaSortUp className={styles.ascIcon}/></button>
                            <button className={styles.descBtn} onClick={() => handleDescButtonClick("created_at")}><FaSortDown className={styles.descIcon}/></button>
                        </th>
                        <th className={styles.column}>
                            更新日時
                            <button className={styles.ascBtn} onClick={() => handleAscButtonClick("updated_at")}><FaSortUp className={styles.ascIcon}/></button>
                            <button className={styles.descBtn} onClick={() => handleDescButtonClick("updated_at")}><FaSortDown className={styles.descIcon}/></button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentDictionaryEntries.map(currentDictionaryEntry => (
                        <tr key={currentDictionaryEntry.entry}>
                            <td>
                                <button
                                    className={styles.entry}
                                    onClick={() => handleUpdateClick(currentDictionaryEntry.entry)}
                                >{currentDictionaryEntry.entry}</button>
                            </td>
                            <td>{currentDictionaryEntry.created_at.split("T")[0]}</td>
                            <td>{currentDictionaryEntry.updated_at.split("T")[0]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table