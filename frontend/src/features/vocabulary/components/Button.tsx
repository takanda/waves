import React from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import { clearEditingPosList, postAsyncVocabulary, updateAsyncVocabulary, deleteAsyncVocabulary } from '../../../redux/modules/vocabulary';
import styles from "../styles/Button.module.css";


const Button = () => {
    const inputEnglish = useAppSelector(state => state.vocabulary.inputEnglish);
    const inputMeanings = useAppSelector(state => state.vocabulary.inputMeanings);
    const editingPosList = useAppSelector(state => state.vocabulary.editingPosList);
    const isUpdate = useAppSelector(state => state.vocabulary.isUpdate);
    const editingVocabularyMeaningList = useAppSelector(state => state.vocabulary.editingVocabularyMeaningList);
    const dispatch = useAppDispatch();
    const handleInsertButtonClick = () => {
        if (editingPosList.length === 1 && inputMeanings[editingPosList[0]].length === 1) {
            const postData = { show_text: inputEnglish, meaning: inputMeanings[editingPosList[0]][0], part_of_speech: editingPosList[0] };
            dispatch(postAsyncVocabulary(postData));
        } else {
            const postData: {}[] = [];
            for (const editingPos of editingPosList) {
                for (const inputMeaning of inputMeanings[editingPos]) {
                    postData.push({ show_text: inputEnglish, meaning: inputMeaning, part_of_speech: editingPos });
                }
            }
            dispatch(postAsyncVocabulary(postData));
        }
        dispatch(clearEditingPosList());
    };

    const handleUpdateButtonClick = () => {
        let updateData;
        if (editingVocabularyMeaningList.length === 1 && editingVocabularyMeaningList[0]["part_of_speech"] === editingPosList[0]) {
            updateData = { ...editingVocabularyMeaningList[0], meaning: inputMeanings[editingPosList[0]][0] };
        } else {
            let updateMeanings = { ...inputMeanings };
            updateData = editingVocabularyMeaningList.map(editingVocabularyMeaning => {
                const meaning = updateMeanings[editingVocabularyMeaning.part_of_speech][0]
                if (updateMeanings[editingVocabularyMeaning.part_of_speech].length === 1) {
                    delete updateMeanings[editingVocabularyMeaning.part_of_speech];
                } else {
                    updateMeanings[editingVocabularyMeaning.part_of_speech].shift();
                }   
                return { ...editingVocabularyMeaning, meaning: meaning };
            });
        }

        dispatch(updateAsyncVocabulary(updateData));
    };

    const handleDeleteButtonClick = () => {
        if (isUpdate && inputEnglish) {
            dispatch(deleteAsyncVocabulary(inputEnglish.replace(/\s/g, "").toLowerCase()));
        }
    };
    return (
        <div className={styles.footer}>
            {isUpdate ? (
                <div>
                    <button aria-label='update-button' onClick={handleUpdateButtonClick}>更新</button>
                    <button aria-label='delete-button' onClick={handleDeleteButtonClick}>削除</button>
                </div>
            ) : (
                <button aria-label='insert-button' onClick={handleInsertButtonClick}>保存</button>
            )}
        </div>
    )
}

export default Button