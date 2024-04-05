import React, { useRef, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks'
import styles from '../styles/Quiz.module.css'
import { updateShowAnswer } from '../../../redux/modules/quiz'


const Quiz = () => {
    const message = useAppSelector(state => state.quiz.message);
    const dictionaryEntries = useAppSelector(state => state.quiz.dictionaryEntries);
    const currentIndex = useAppSelector(state => state.quiz.currentIndex);
    const showAnswer = useAppSelector(state => state.quiz.showAnswer);
    const isStart = useAppSelector(state => state.quiz.isStart);
    const partsOfSpeech = useAppSelector(state => state.partsOfSpeech.partsOfSpeech);
    const dispatch = useAppDispatch();

    const inputEls = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!showAnswer.includes(true)) {
            inputEls.current[0]?.focus();
        }
    }, [showAnswer]);

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        let index = parseInt(e.currentTarget.id);
        if (e.key === "Enter") {
            dispatch(updateShowAnswer(index));
            for (let i = index; i < showAnswer.length; i++) {
                if (!showAnswer[i + 1]) {
                    inputEls.current[i + 1]?.focus();
                    break;
                }
            }
        }
    };

    if (message.loading) {
        return <h1>{message.loading}</h1>;
    }

    if (isStart && !dictionaryEntries.length) {
        return <h1>本日のテストはありません</h1>;
    }
    return (
        <div className={styles.quizContainer}>
            <h1>{dictionaryEntries[currentIndex].entry}</h1>
            {dictionaryEntries[currentIndex]?.entry_definitions.map((entryDefinition, index) => (
                <div className={styles.meaningContainer} key={index}>
                    <h2 className={styles.partOfSpeech}>{partsOfSpeech.find(partOfSpeech => partOfSpeech.id === entryDefinition.part_of_speech)?.ja_name}</h2>
                    {showAnswer[index] ? (
                        <input
                            id={index.toString()}
                            ref={el => inputEls.current[index] = el}
                            className={styles.meaning}
                            value={entryDefinition.meaning}
                            readOnly
                        />
                    ) : (
                        <input
                            id={index.toString()}
                            ref={el => inputEls.current[index] = el}
                            className={styles.meaning}
                            value=""
                            onKeyDown={handleKeyDown}
                            readOnly
                        />
                    )}
                </div>
            ))}
        </div>
    )
}

export default Quiz