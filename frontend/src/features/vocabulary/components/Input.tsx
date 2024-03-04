import React from 'react'
import { PartOfSpeech } from '../../../redux/modules/parts_of_speech'

interface InputProps {
    partOfSpeechChecked: PartOfSpeech;
    index: number;
    inputMeaning: string;
    handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
};

const Input = (props: InputProps) => {
    return (
        <input
            id={`${props.partOfSpeechChecked.id}-${props.index}`}
            aria-label={`${props.partOfSpeechChecked.id}-${props.index}`}
            type="text"
            value={props.inputMeaning}
            onChange={props.handleInputChange}
        />
    )
}

export default Input