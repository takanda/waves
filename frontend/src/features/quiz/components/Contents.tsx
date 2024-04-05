import React from 'react'
import Button from './Button'
import Quiz from './Quiz';
import { useAppSelector } from '../../../redux/store/hooks';

const QuizContents = () => {
    const dictionaryEntries = useAppSelector(state => state.quiz.dictionaryEntries);
    const currentIndex = useAppSelector(state => state.quiz.currentIndex);
    const isStart = useAppSelector(state => state.quiz.isStart);

    if (dictionaryEntries.length && currentIndex >= dictionaryEntries.length) {
        return (
            <>
                <h1>クイズ終了</h1>
                <h1>戻るボタンを押してください</h1>
            </>
        )
    }
    return (
        <>
            {isStart ? (
                <Quiz />
            ) : (
                <h1>クイズ</h1>
            )}
            <Button />
        </>
    )
}

export default QuizContents