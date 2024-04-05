import React from 'react';
import { useAppSelector } from "../../../redux/store/hooks";
import List from './List';
import Form from './Form';
import Footer from './Button';


const Contents = () => {
    const isVisibleVocabularies = useAppSelector((state) => state.vocabulary.isVisibleVocabularies);
    return (
        <>
            <h1>Vocabulary DB</h1>
            {isVisibleVocabularies ? (
                <List />
            ) : (
                <>
                    <Form />
                    <Footer />
                </>
            )}
        </>
    );
};

export default Contents