import React from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import styles from "../styles/Input.module.css";
import { updateInputEnglish, addInputMeanings, updateInputMeanings, minusInputMeanings } from '../../../redux/modules/vocabulary';


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
    const handleButtonClick = (partOfSpeechId: number, index: number) => {
        if (index === 0) {
            dispatch(addInputMeanings(partOfSpeechId));
        } else {
            dispatch(minusInputMeanings({ partOfSpeechId, index }));
        }
    };

    return (
        <>
            <div className={styles.inputContainer}>
                <label htmlFor="english-word-input">英単語/フレーズ</label>
                {isUpdate ? (
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
                <div className={styles.inputContainer} key={partOfSpeechChecked.id}>
                    <label htmlFor={`${partOfSpeechChecked.id}`}>{partOfSpeechChecked.ja_name}</label>
                    {inputMeanings[partOfSpeechChecked.id].map((inputMeaning, index) => (
                        <div key={`${partOfSpeechChecked.id}-${index}`} className={styles.input}>
                            <input
                                id={`${partOfSpeechChecked.id}-${index}`}
                                aria-label={`${partOfSpeechChecked.id}-${index}`}
                                type="text"
                                value={inputMeaning}
                                onChange={handleInputChange}
                            />

                            {index === 0 ? (
                                <button
                                    className={styles.btn}
                                    aria-label={`plus-${partOfSpeechChecked.id}-button`}
                                    onClick={() => handleButtonClick(partOfSpeechChecked.id, index)}
                                >
                                    <CiCirclePlus size={40} />
                                </button>
                            ) : (
                                <button
                                    className={styles.btn}
                                    aria-label={`minus-${partOfSpeechChecked.id}-${index}-button`}
                                    onClick={() => handleButtonClick(partOfSpeechChecked.id, index)}
                                >
                                    <CiCircleMinus size={40} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ))}

        </>
    )
}

export default Input