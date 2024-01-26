import React from 'react'
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import styles from "./Input.module.css";
import { updateInputEnglish, updateInputMeanings } from '../redux/modules/vocabulary';


const Input = () => {
    const partsOfSpeech = useAppSelector((state) => state.partsOfSpeech.partsOfSpeech);
    const editingPosList = useAppSelector((state) => state.vocabulary.editingPosList);
    const inputEnglish = useAppSelector((state) => state.vocabulary.inputEnglish);
    const inputMeanings = useAppSelector((state) => state.vocabulary.inputMeanings);
    const isUpdate = useAppSelector((state) => state.vocabulary.isUpdate);
    const dispatch = useAppDispatch();

    const partsOfSpeechChecked = partsOfSpeech.filter(partOfSpeech => editingPosList.includes(partOfSpeech.id));

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.id === "english-word-input") {
            dispatch(updateInputEnglish(e.target.value));
        } else {
            dispatch(updateInputMeanings({ id: e.target.id, inputMeaning: e.target.value }));
        }
    };

    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <h1>Vocabulary DB</h1>
                <div className={styles.input}>
                    <label htmlFor="english-word-input">英単語/フレーズ</label>
                    { isUpdate ? (
                        <input
                            id="english-word-input"
                            type="text"
                            aria-label="english-word-input"
                            value={inputEnglish}
                            onChange={handleInputChange}
                            readOnly
                        />
                    ) : (
                        <input
                            id="english-word-input"
                            type="text"
                            aria-label="english-word-input"
                            value={inputEnglish}
                            onChange={handleInputChange}
                        />
                    )}
                </div>

                {partsOfSpeechChecked.map(partOfSpeechChecked => (
                    <div className={styles.input} key={partOfSpeechChecked.id}>
                        <label htmlFor={`${partOfSpeechChecked.id}`}>{partOfSpeechChecked.ja_name}</label>
                        <input
                            id={`${partOfSpeechChecked.id}`}
                            type="text"
                            aria-label={`${partOfSpeechChecked.id}`}
                            value={inputMeanings[partOfSpeechChecked.id]}
                            onChange={handleInputChange}
                        />
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Input