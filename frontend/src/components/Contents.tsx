import React from 'react'
import { useAppSelector } from '../redux/store/hooks'
import styles from '../styles/Contents.module.css'
import VocabularyContents from '../features/vocabulary/components/Contents'
import QuizContents from '../features/quiz/components/Contents'


const Contents = () => {
    const isQuiz = useAppSelector(state => state.quiz.isQuiz);

    return (
        <div className={styles.main}>
            <div className={styles.content}>
                {isQuiz ? (
                    <QuizContents />
                ) : (
                    <VocabularyContents />
                )}
            </div>
        </div>
    )
}

export default Contents