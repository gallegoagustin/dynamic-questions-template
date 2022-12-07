import React from 'preact/compat';
import { useReducer, useState, useEffect } from "preact/hooks";
import { reducer, initialState } from "./state.js";
import Question from './question.js';
import './index.css';

const DynamicQuestion = ({url, label, token}) => {
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

    const handleSaveEvent = async () => {
        const endpoint = url.includes('localhost') ? `http://${url}` : `https://${url}`;
        const formData = new FormData();
        const bodyData = {...state.data[0], label: label};
        delete bodyData.state;
        formData.append('json_object', JSON.stringify(bodyData));
        formData.append('name', label);
        formData.append('item_type', 'question');
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'X-CSRFToken': token
            },
            body: formData,
        });
        console.log('SAVE EVENT RESULT: ', response);
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
                <button
                    class='crtJson'
                    style={{visibility: 'hidden'}}
                    onClick={async (e) => {
                        e.preventDefault();
                        await handleSaveEvent();
                    }}
                >Save</button>
            </div>
        </div>
    );
};

export default DynamicQuestion;