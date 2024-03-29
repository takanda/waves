import React from 'react'
import styles from "../styles/PlusMinusButton.module.css";
import { PartOfSpeech } from '../../../redux/modules/parts_of_speech'
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";

interface ButtonProps {
    button: string;
    partOfSpeechChecked: PartOfSpeech;
    handleButtonClick:  (partOfSpeechId: number, ...args: number[]) => void;
    index?: number;
};

const PlusMinusButton = (props: ButtonProps) => {
    return (
        <button
            className={styles.btn}
            aria-label={`${props.button}-${props.partOfSpeechChecked.id}-button`}
            onClick={() => props.index !== undefined
                ? props.handleButtonClick(props.partOfSpeechChecked.id, props.index)
                : props.handleButtonClick(props.partOfSpeechChecked.id)}
        >
            {props.button === "plus" ? <CiCirclePlus size={40} /> : <CiCircleMinus size={40} />}
        </button>
    )
}

export default PlusMinusButton