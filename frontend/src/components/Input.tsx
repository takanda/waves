import React from 'react'
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import styles from "./Input.module.css";
import { updateInputEnglish, updateInputMeanings } from '../redux/modules/vocabulary';


const Input = () => {
    const partsOfSpeech = useAppSelector((state) => state.partsOfSpeech.partsOfSpeech);
    const isChecked = useAppSelector((state) => state.partsOfSpeech.isChecked);
    const inputEnglish = useAppSelector(state => state.vocabulary?.inputEnglish);
    const inputMeanings = useAppSelector(state => state.vocabulary?.inputMeanings);
    const dispatch = useAppDispatch();

    const partsOfSpeechChecked = partsOfSpeech.filter(partOfSpeech => isChecked.includes(partOfSpeech.id));

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if(e.target.id === "english-word-input") {
            dispatch(updateInputEnglish(e.target.value));
        } else {
            dispatch(updateInputMeanings({id: e.target.id, inputMeaning: e.target.value}));
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <h1>Vocabulary DB</h1>
                <div className={styles.input}>
                    <label htmlFor="english-word-input">英単語/フレーズ</label>
                    <input
                        id="english-word-input"
                        type="text"
                        value={inputEnglish}
                        onChange={handleInputChange}
                    />
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