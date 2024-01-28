import React from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import { clearEditingPosList, postAsyncVocabulary, updateAsyncVocabulary, deleteAsyncVocabulary } from '../../../redux/modules/vocabulary';
import styles from "../styles/Button.module.css";


const Button = () => {
    const inputEnglish = useAppSelector(state => state.vocabulary.inputEnglish);
    const inputMeanings = useAppSelector(state => state.vocabulary.inputMeanings);
    const editingPosList = useAppSelector(state => state.vocabulary.editingPosList);
    const isUpdate = useAppSelector(state => state.vocabulary.isUpdate);
    const editingVocabularyList = useAppSelector(state => state.vocabulary.editingVocabularyList);
    const dispatch = useAppDispatch();
    const handleInsertButtonClick = () => {
        if (editingPosList.length === 1) {
            const postData = { show_text: inputEnglish, meaning: inputMeanings[editingPosList[0]], part_of_speech: editingPosList[0] };
            dispatch(postAsyncVocabulary(postData));
        } else {
            const postData: {}[] = [];
            editingPosList.map(editingPos => (
                postData.push({ show_text: inputEnglish, meaning: inputMeanings[editingPos], part_of_speech: editingPos })
            ));
            dispatch(postAsyncVocabulary(postData));
        }
        dispatch(clearEditingPosList());
    };

    const handleUpdateButtonClick = () => {
        const updateData = editingVocabularyList.map(editingVocabulary => {
            return { ...editingVocabulary, meaning: inputMeanings[editingVocabulary.part_of_speech] };
        });
        dispatch(updateAsyncVocabulary(updateData));
    };

    const handleDeleteButtonClick = () => {
        if (isUpdate && inputEnglish) {
            dispatch(deleteAsyncVocabulary(inputEnglish.replace(/\s/g,"").toLowerCase()));
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