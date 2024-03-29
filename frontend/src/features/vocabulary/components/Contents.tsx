import React from 'react';
import { useAppSelector } from "../../../redux/store/hooks";
import styles from "../styles/Contents.module.css";
import List from './List';
import Form from './Form';
import Footer from './Button';


const Contents = () => {
    const isVisibleVocabularies = useAppSelector((state) => state.vocabulary.isVisibleVocabularies);
    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <h1>Vocabulary DB</h1>
                {isVisibleVocabularies ? (
                    <List />
                ) : (
                    <>
                        <Form />
                        {isVisibleVocabularies ? <></> :  <Footer />}
                    </>
                )}
            </div>
        </div>
    );
};

export default Contents