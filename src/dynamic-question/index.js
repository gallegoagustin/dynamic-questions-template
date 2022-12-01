import React from 'preact/compat';
import { useReducer, useState, useEffect } from "preact/hooks";
import { reducer, initialState } from "./state.js";
import Question from './question.js';
import './styles/index.css';

const DynamicQuestion = () => {
    const nestLevel = 0;
  
    const [state, dispatch] = useReducer(reducer, initialState);
  
    const [json, setJson] = useState(initialState.data);
    const [counter, setCounter] = useState(0);
  
    const handleDeleteSection = (index) => {
        dispatch({ type: 'DELETE_SECTION', payload: index });
    };
  
    const onUpdateDispatch = (data, index) => {
        dispatch({ type: 'UPDATE_STATE', payload: {
            data,
            index,
        } });
    };
  
    useEffect(() => {
        setJson(state.data);
        setCounter(counter + 1);
        dispatch({ type: 'IS_NOT_EDITING' });
    }, [state.data, initialState]);
  
    return (
        <div id='crt'>
            {json && json.map((dynamicQuestion, index) => (
                <Question 
                    key={`${index}-${counter}`}
                    {...dynamicQuestion}
                    position={index}
                    updateFunc={onUpdateDispatch}
                    level={nestLevel}
                    deleteSection={handleDeleteSection}
                    state={state}
                    dispatch={dispatch}
                />
            ))}
            <div className='bottomButtonsContainer'>
                <button id='crtJson' style={{visibility: 'hidden'}} onClick={() => console.log('JSON RESULT:', state.data[0])}>Save</button>
            </div>
        </div>
    );
};

export default DynamicQuestion;
