import React from 'react';
import { useAppSelector } from "../../../redux/store/hooks";
import styles from "../styles/Contents.module.css";
import List from './List';
import Input from './Input';


const Contents = () => {
    const isVisibleShowTextList = useAppSelector((state) => state.vocabulary.isVisibleShowTextList);
    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <h1>Vocabulary DB</h1>
                {isVisibleShowTextList ? (
                    <List />
                ) : (
                    <Input />
                )}
            </div>
        </div>
    );
};

export default Contents