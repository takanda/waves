import React from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import { PostData, PutData, clearEditingPosList, fetchAsyncVocabulary, postAsyncVocabulary, updateAsyncVocabulary, deleteAsyncVocabulary, postAsyncDefinition, deleteAsyncDefinition } from '../../../redux/modules/vocabulary';
import styles from "../styles/Button.module.css";


const Button = () => {
    const entry = useAppSelector(state => state.vocabulary.entry);
    const meanings = useAppSelector(state => state.vocabulary.meanings);
    const editingPosList = useAppSelector(state => state.vocabulary.editingPosList);
    const updateDefinitionIds = useAppSelector(state => state.vocabulary.updateDefinitionIds);
    const isUpdate = useAppSelector(state => state.vocabulary.isUpdate);
    const isSearch = useAppSelector(state => state.vocabulary.isSearch);
    const validationResult = useAppSelector(state => state.vocabulary.validationResult);
    const dispatch = useAppDispatch();
    const handleInsertButtonClick = () => {
        const postData: PostData = {
            entry: entry,
            entry_definitions: []
        };
        for (const editingPos of editingPosList) {
            for (const meaning of meanings[editingPos]) {
                const entryDefinition = {
                    meaning: meaning,
                    part_of_speech: editingPos,
                };
                postData.entry_definitions.push(entryDefinition);
            }
        }
        dispatch(postAsyncVocabulary(postData));
        dispatch(clearEditingPosList());
    };

    const handleUpdateButtonClick = () => {
        const postData: PostData = {
            entry: entry,
            entry_definitions: [],
        };
        const putData: PutData = {
            entry: entry,
            entry_definitions: [],
        };
        const deleteData: { deleted_definition_ids: number[] } = {
            deleted_definition_ids: []
        };
        // posごとにupdateDefinitionIdsの数とmeaningの数を比較して
        // 多い場合は差分をinsert(残りはupdate)
        // 少ない場合は差分をdelete(消すのは古いのから)(残りはupdate)
        for (const editingPos of editingPosList) {
            const ids = editingPos in updateDefinitionIds ? [...updateDefinitionIds[editingPos]] : [];
            const diff = meanings[editingPos].length - ids.length
            if (diff < 0) {
                deleteData.deleted_definition_ids = deleteData.deleted_definition_ids.concat(ids.splice(0, Math.abs(diff)));
            }
            const post_entry_definitions = [];
            const put_entry_definitions = [];

            for (let index = 0; index < meanings[editingPos].length; index++) {
                if (index >= ids.length) {
                    post_entry_definitions.push({ meaning: meanings[editingPos][index], part_of_speech: editingPos });
                } else {
                    put_entry_definitions.push({ id: ids[index], meaning: meanings[editingPos][index], part_of_speech: editingPos });
                }
            }
            if (diff > 0) {
                postData.entry_definitions = postData.entry_definitions.concat(post_entry_definitions);
                putData.entry_definitions = putData.entry_definitions.concat(put_entry_definitions);
            } else {
                putData.entry_definitions = putData.entry_definitions.concat(put_entry_definitions);
            }
        }
        if (postData.entry_definitions.length) {
            dispatch(postAsyncDefinition(postData));
            console.log("A")
        }
        if (putData.entry_definitions.length) {
            dispatch(updateAsyncVocabulary(putData));
            console.log("B")
        }
        if (deleteData.deleted_definition_ids.length) {
            dispatch(deleteAsyncDefinition(deleteData));
            console.log("C")
        }
        dispatch(clearEditingPosList());
    };

    const handleDeleteButtonClick = () => {
        if (isUpdate && entry) {
            dispatch(deleteAsyncVocabulary(entry));
        }
    };

    const handleSearchButtonClick = () => {
        dispatch(fetchAsyncVocabulary(entry));
    };

    return (
        <div className={styles.button}>
            {isUpdate ? (
                <div>
                    <button className={styles.updateBtn} aria-label='update-button' onClick={handleUpdateButtonClick}>更新</button>
                    <button className={styles.deleteBtn} aria-label='delete-button' onClick={handleDeleteButtonClick}>削除</button>
                </div>
            ) : (
                <>
                    {isSearch ? (
                        <button className={styles.searchBtn} aria-label='search-button' onClick={handleSearchButtonClick}>検索</button>
                    ) : (
                        <button className={styles.insertBtn} aria-label='insert-button' onClick={handleInsertButtonClick} disabled={validationResult.isInputEntryError}>保存</button>
                    )}
                </>
            )}
        </div>
    )
}

export default Button