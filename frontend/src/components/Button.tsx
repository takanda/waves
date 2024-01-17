import React from 'react'
import { useAppSelector, useAppDispatch } from '../redux/store/hooks';
import { postAsyncVocabulary } from '../redux/modules/vocabulary';
import { clearIsChecked } from '../redux/modules/parts_of_speech';
import styles from "./Button.module.css";




const Button = () => {
    const inputEnglish = useAppSelector(state => state.vocabulary.inputEnglish);
    const inputMeanings = useAppSelector(state => state.vocabulary.inputMeanings);
    const editingPosList = useAppSelector(state => state.vocabulary.editingPosList);
    const dispatch = useAppDispatch();
    const clickHandler = () => {
        if(editingPosList.length === 1) {
            const postData = {show_text: inputEnglish, meaning: inputMeanings[editingPosList[0]], part_of_speech: editingPosList[0]};
            dispatch(postAsyncVocabulary(postData));
        } else {
            const postData: {}[] = [];
            editingPosList.map(editingPos => (
                postData.push({show_text: inputEnglish, meaning: inputMeanings[editingPos], part_of_speech: editingPos})
            ));
            console.log(postData)
            dispatch(postAsyncVocabulary(postData));
        }
        dispatch(clearIsChecked());
    }
    return (
        <div className={styles.footer}>
            <button onClick={clickHandler}>保存</button>
        </div>
    )
}

export default Button