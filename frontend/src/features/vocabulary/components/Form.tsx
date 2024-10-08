import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import styles from "../styles/Form.module.css";
import { setEntry, checkAsyncEntry, addInputMeanings, updateInputMeanings, minusInputMeanings } from '../../../redux/modules/vocabulary';
import Input from './Input';
import PlusMinusButton from './PlusMinusButton';


const Form = () => {
    const partsOfSpeech = useAppSelector((state) => state.partsOfSpeech.partsOfSpeech);
    const editingPosList = useAppSelector((state) => state.vocabulary.editingPosList);
    const entry = useAppSelector((state) => state.vocabulary.entry);
    const meanings = useAppSelector((state) => state.vocabulary.meanings);
    const isUpdate = useAppSelector((state) => state.vocabulary.isUpdate);
    const isSearch = useAppSelector((state) => state.vocabulary.isSearch);
    const validationResult = useAppSelector((state) => state.vocabulary.validationResult);
    const dispatch = useAppDispatch();

    const partsOfSpeechChecked = partsOfSpeech.filter(partOfSpeech => editingPosList.includes(partOfSpeech.id));

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.target.id === "english-word-input") {
            dispatch(setEntry(e.target.value));
        } else {
            dispatch(updateInputMeanings({ id: e.target.id, inputMeaning: e.target.value }));
        }
    };
    const handleButtonClick = (partOfSpeechId: number, ...args: number[]) => {
        const index = args.pop();
        if (index !== undefined) {
            dispatch(minusInputMeanings({ partOfSpeechId, index }));
        } else {
            dispatch(addInputMeanings(partOfSpeechId));
        }
    };
    const handleInputBlur = () => {
        if (!isUpdate && !isSearch) {
            dispatch(checkAsyncEntry(entry));
        }
    };

    return (
        <>
            <div className={styles.inputContainer}>
                <label htmlFor="english-word-input">英単語/フレーズ</label>
                <input
                    id="english-word-input"
                    type="text"
                    aria-label="english-word-input"
                    value={entry}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    readOnly={isUpdate}
                />
                {!isUpdate && validationResult.errorMessage.inputEntry && <p className={styles.errorMessage}>{validationResult.errorMessage.inputEntry}</p>}
                {isSearch && validationResult.errorMessage.searchEntry && <p>{validationResult.errorMessage.searchEntry}</p>}
            </div>

            {partsOfSpeechChecked.map(partOfSpeechChecked => (
                <div className={styles.inputContainer} key={partOfSpeechChecked.id}>
                    <label htmlFor={`${partOfSpeechChecked.id}`}>{partOfSpeechChecked.ja_name}</label>
                    <PlusMinusButton button='plus' partOfSpeechChecked={partOfSpeechChecked} handleButtonClick={handleButtonClick} />
                    {meanings[partOfSpeechChecked.id].map((inputMeaning, index) => (
                        <div key={`${partOfSpeechChecked.id}-${index}`} className={styles.input}>
                            <Input partOfSpeechChecked={partOfSpeechChecked} index={index} inputMeaning={inputMeaning} handleInputChange={handleInputChange} />
                            <PlusMinusButton button='minus' partOfSpeechChecked={partOfSpeechChecked} handleButtonClick={handleButtonClick} index={index} />
                        </div>
                    ))}
                </div>
            ))}

        </>
    )
}

export default Form