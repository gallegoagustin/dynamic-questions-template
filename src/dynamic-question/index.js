import React from 'preact/compat';
import { useReducer, useState, useEffect } from "preact/hooks";
import { reducer, initialState } from "./state.js";
import Question from './question.js';
import './index.css';

const DynamicQuestion = ({webjson, url, label, reload, token}) => {
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
        dispatch({ type: 'HAS_CHANGES' });
    };

    const handleSaveEvent = async () => {
        if (!state.hasChanges) return;

        const endpoint = url.includes('localhost') ? `http://${url}` : `https://${url}`;

        const handleStateKeys = (arr) => {
            const newArr = [...arr];
            for (let i = 0; i < newArr.length; i++) {
                if (newArr[i].question !== null) {
                    const arrKeys = Object.keys(newArr[i].question);
                    if (arrKeys.includes('state')) {
                        delete newArr[i].question['state'];
                    }
                    if (newArr[i].question.values.length) {
                        const newValues = handleStateKeys(newArr[i].question.values);
                        newArr[i].question.values = newValues;
                    }
                }
            }
            return newArr;
        };

        const body = {
            'name': label,
            'item_type': 'question',
            'json_object': {
                id: state.data[0].id,
                label: label,
                question: state.data[0].question,
                type: state.data[0].type,
                values: state.data[0].values,
                answer: state.data[0].answer,
            }
        };

        const newArray = handleStateKeys(body.json_object.values);
        body.json_object.values = newArray;

        var formData = new FormData();

        formData.append('name', body['name']);
        formData.append('item_type', body['item_type']);
        formData.append('json_object', JSON.stringify(body['json_object']));

        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'X-CSRFToken': token
            },
            body: formData,
        });
    };

    useEffect(() => {
        if (webjson && webjson != 'null') {
            dispatch({ type: 'UPDATE_STATE', payload: {
                data: JSON.parse(webjson),
                index: 0,
            } });
        }
    }, []);

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
                        if(reload) window.location.href = reload;
                    }}
                >Save</button>
            </div>
        </div>
    );
};

export default DynamicQuestion;