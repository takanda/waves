import React from 'react'
import { PartOfSpeech } from '../../../redux/modules/parts_of_speech';

interface PartOfSpeechProps {
    partOfSpeech: PartOfSpeech;
    editingPosList: number[];
    handleCheckboxChange: (partOfSpeech: PartOfSpeech) => void;
}

const PartOfSpeechCheckBox = (props: PartOfSpeechProps) => {
    return (
        <div key={props.partOfSpeech.id}>
            <input
                id={`${props.partOfSpeech.id}-checkbox`}
                type="checkbox"
                aria-label={`${props.partOfSpeech.id}-checkbox`}
                checked={props.editingPosList.includes(props.partOfSpeech.id) ? true : false}
                onChange={() => props.handleCheckboxChange(props.partOfSpeech)}
            />
            <label htmlFor={`${props.partOfSpeech.id}-checkbox`}>{props.partOfSpeech.ja_name}</label>
        </div>
    )
}

export default PartOfSpeechCheckBox