import { useEffect, useState } from "preact/hooks";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getUniqueKey } from "./utils.js";

const Question = (qdata) => {
    const nestLevel = qdata.level + 1;
  
    const [questionData, setQuestionData] = useState(qdata);
  
    const [inputRecord, setInputRecord] = useState({
        sectionTitle: questionData.label,
        question: questionData.question,
        label: questionData.label,
        values: questionData.values.map(item => item.value),
    });
  
    const [inputActive, setInputActive] = useState({
        sectionTitle: false,
        question: false,
        label: false,
        values: questionData.values.map(() => false),
    });

    const [newValueInput, setNewValueInput] = useState('');
    const [addValueVisible, setAddValueVisible] = useState(false);

    const [newQuestionInput, setNewQuestionInput] = useState('');
    const [newQuestionVisible, setNewQuestionVisible] = useState(true);
  
    // START EVENT HANDLERS
    const toggleActiveInputs = (field, values) => {
        qdata.dispatch({ type: 'IS_EDITING' });
        switch (field) {
        case 'section-title':
            setInputActive({
                sectionTitle: true,
                question: false,
                label: false,
                values: questionData.values.map(() => false),
            });
            return;
        case 'question':
            setInputActive({
                sectionTitle: false,
                question: true,
                label: false,
                values: questionData.values.map(() => false),
            });
            return;
        case 'label':
            setInputActive({
                sectionTitle: false,
                question: false,
                label: true,
                values: questionData.values.map(() => false),
            });
            return;
        case 'values':
            setInputActive({
                sectionTitle: false,
                question: false,
                label: false,
                values,
            });
            return;
        default:
            break;
        }
    };
   
    const addQuestion = (valuePos) => {
        qdata.dispatch({type: 'SET_NEST_VALUE_ACTIVE', payload: null});
        const newdq = {...questionData, values: [ ...questionData.values ]};
        newdq.values[valuePos] = {
            ...newdq.values[valuePos],
            conditional: true,
            question: {
                id: getUniqueKey(nestLevel),
                label: '',
                type: 'multiple',
                values: []
            }
        };
        setQuestionData(newdq);
        setInputRecord({...inputRecord, values: newdq.values.map(item => item.value)});
        questionData.updateFunc(newdq, questionData.position);
    };
  
    const removeCondition = (index) => {
        const newdq = {...questionData, values: [ ...questionData.values ] };
        newdq.values[index] = {
            ...newdq.values[index],
            conditional: false,
            question: null,
        };
        setQuestionData(newdq);
        questionData.updateFunc(newdq, questionData.position);
    };
  
    const addValue = () => {
        const newData = {
            ...questionData,
            values: [
                ...questionData.values,  
                {
                    value: newValueInput,
                    conditional: false,
                    question: null,
                    order: questionData.values.length - 1
                }
            ]
        };
        setQuestionData(newData);
        qdata.dispatch({type: 'SET_NEST_VALUE_ACTIVE', payload: nestLevel})
        questionData.updateFunc(newData, newData.position);
    };
  
    const removeValue = (index) => {
        const part1 = [...questionData.values].slice(0, index);
        const part2 = [...questionData.values].slice(index + 1, questionData.values.length - index + 1);
        const newValues = [...part1, ...part2];
        const newData = {
            ...questionData,
            values: [...newValues],
        };
        setQuestionData(newData);
        questionData.updateFunc(newData, newData.position);
    };
  
    const handleValueLabel = (data, index) => {
        const part1 = [...questionData.values].slice(0, index);
        const part2 = [...questionData.values].slice(index + 1, questionData.values.length - index + 1);
        const dataToInsert = {...questionData.values[index], value: data};
        const newValues = [...part1, dataToInsert, ...part2];
        const newData = {...questionData, values: newValues};
        setQuestionData(newData);
        questionData.updateFunc(newData, questionData.position);
    };
  
    const handleLabel = (value) => {
        const newData = {...questionData, label: value};
        setQuestionData(newData);
        qdata.dispatch({type: 'SET_NEST_VALUE_ACTIVE', payload: nestLevel})
        questionData.updateFunc(newData, questionData.position);
    };
  
    const handleMainQuestion = (value) => {
        const newData = {...questionData, question: value};
        setQuestionData(newData);
        qdata.dispatch({type: 'SET_NEST_VALUE_ACTIVE', payload: nestLevel})
        questionData.updateFunc(newData, questionData.position);
    };
  
    const onUpdateDispatch = (data, index) => {
        const oldValue = questionData.values[index];
        const newValue = {...oldValue, question: data};
        const part1 = questionData.values.slice(0 , index);
        const part2 = questionData.values.slice(index + 1);
        const newValues = [...part1, newValue, ...part2];
        const newData = {...questionData, values: newValues};
        setQuestionData(newData);
        questionData.updateFunc(newData, questionData.position);
    };
    // END EVENT HANDLERS

    // START DRAG & DROP FUNCTIONS
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
          return;
        }
    
        const newValues = reorder(
          questionData.values,
          result.source.index,
          result.destination.index
        );
    
        const newData = {...questionData, values: newValues};
        setQuestionData(newData);
        questionData.updateFunc(newData, questionData.position);
      }

      const getItemStyle = (isDragging, draggableStyle) => ({
        cursor: 'pointer',
        ...draggableStyle
      });
      
      const getListStyle = isDraggingOver => ({});
    // END DRAG & DROP FUNCTIONS

    // START DATA CHANGES LISTENERS
    useEffect(() => {
        if (qdata.state.nestLevelActiveValue === nestLevel) {
            setAddValueVisible(true);
        } else {
            setAddValueVisible(false);
        }
    }, [qdata.state.nestLevelActiveValue])

    useEffect(() => {
        if (nestLevel > 1 && questionData.label.length > 0) setNewQuestionVisible(false);
        if (nestLevel === 1 && questionData.question.length > 0) setNewQuestionVisible(false);
    }, [questionData.label])
    // END DATA CHANGES LISTENERS

    if (newQuestionVisible) return (
        <div style={qdata.level === 0 ? {maxWidth: '100%', marginBottom: '4px'} : {maxWidth: '100%', marginBottom: '4px', marginLeft: '50px'}}>
            <input
                className='addValueInput'
                type='text'
                placeholder='Insert Question'
                value={newQuestionInput} 
                onChange={(e) => {
                    setNewQuestionInput(e.target.value);
                }}
            />
            <button
                className='greyButton'
                onClick={() => {
                    if (nestLevel > 1) handleLabel(newQuestionInput);
                    if (nestLevel === 1) handleMainQuestion(newQuestionInput);
                }}
            >Add</button>
        </div>
    )
  
    return (
        <div className={qdata.level === 0 ? 'containerQuestion' : 'captionQuestion'}>
            <div>
                <div className={'headerQuestion commonSpace'} style={qdata.level !== 0 ? {marginTop: '3px'} : null}>
                    {qdata.level === 0 && <input disabled={!inputActive.question} type='text' placeholder={'Insert question'} value={inputRecord.question} name='' onChange={(e) => setInputRecord({...inputRecord, question: e.target.value})} />}
                    {qdata.level !== 0 && <input disabled={!inputActive.label} type='text' placeholder={'Insert question'} value={inputRecord.label} name='' onChange={(e) => setInputRecord({...inputRecord, label: e.target.value})} />}                 
                    <div className='commonSpace-buttons'>
                        {qdata.level === 0 && !inputActive.question && <div className='pointer' onClick={() => toggleActiveInputs('question')}><img src='./dynamic-question/assets/pen-white.svg' /></div>}
                        {qdata.level === 0 && inputActive.question && <div className='pointer' onClick={() => {
                            handleMainQuestion(inputRecord.question);
                            setInputActive({...inputActive, question: false});
                        }}><img src='./dynamic-question/assets/save-white.svg' /></div>}
                        {qdata.level !== 0 && !inputActive.label && <div className='pointer' onClick={() => toggleActiveInputs('label')}><img src='./dynamic-question/assets/pen-white.svg' /></div>}
                        {qdata.level !== 0 && inputActive.label && <div className='pointer' onClick={() => {
                            handleLabel(inputRecord.label);
                            setInputActive({...inputActive, label: false});
                        }}><img src='./dynamic-question/assets/save-white.svg' /></div>}
                        <div><img src='./dynamic-question/assets/icons-white.svg' onClick={() => {
                            qdata.dispatch({type: 'SET_NEST_VALUE_ACTIVE', payload: nestLevel});
                            questionData.updateFunc(newdq, questionData.position);
                        }} /></div>
                        {qdata.level !== 0 && !inputActive.label && <div className='pointer'  onClick={() => qdata.removeCondition(qdata.position)}><img src='./dynamic-question/assets/trash-white.svg' /></div>}
                    </div>
                </div>

                <div style={qdata.level !== 0 ? {marginBottom: '3px'} : null}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {questionData.values.map((question, index) => (
                                        <>
                                        <Draggable key={index} draggableId={`${question.order}`} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                                >
                                                <div id={index} key={index}>
                                                    <div className={index % 2 === 0 ? 'evenRow commonSpace' : 'oddRow commonSpace'} id={index} key={index}>
                                                        <div style={{width: '5%'}}><img src='./dynamic-question/assets/drag-grey.svg' /></div>
                                                        <input 
                                                            disabled={!inputActive.values[index]}
                                                            type='text' placeholder={'Insert value'}
                                                            value={inputRecord.values[index]}
                                                            name='value'
                                                            onChange={(e) => {
                                                                const newValues = [...inputRecord.values];
                                                                newValues[index] = e.target.value;
                                                                setInputRecord({...inputRecord, values: newValues});
                                                            }}
                                                            style={{width: '85%'}}
                                                        />
                                                        <div className='commonSpace-buttons' style={{width: '10%'}}>
                                                            {nestLevel <= 2 && !question.conditional && (
                                                                <div style={{ marginRight: '3px' }} onClick={() => addQuestion(index)}><img src='./dynamic-question/assets/plus-grey.svg' /></div>
                                                            )}
                                                            {!inputActive.values[index] && <div
                                                                style={{ marginRight: '3px' }}
                                                                disabled={qdata.state.isEditing}
                                                                    onClick={() => {
                                                                        const newValues = inputActive.values.map(() => false);
                                                                        newValues[index] = true;
                                                                        toggleActiveInputs('values', newValues);
                                                                    }}><img src='./dynamic-question/assets/pen-grey.svg' />
                                                                </div>}
                                                            {inputActive.values[index] && <div
                                                                style={{ marginRight: '3px' }}
                                                                onClick={() => {
                                                                    handleValueLabel(inputRecord.values[index], index);
                                                                    const newValues = [...inputActive.values];
                                                                    newValues[index] = false;
                                                                    setInputActive({...inputActive, values: newValues});
                                                                }}><img src='./dynamic-question/assets/save-grey.svg' />
                                                            </div>}
                                                            <div onClick={() => removeValue(index)} style={{ marginRight: '3px' }}><img src='./dynamic-question/assets/trash-grey.svg' /></div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            )}
                                        </Draggable>
                                        <div>
                                            {question.conditional && (
                                                <Question
                                                    key={`${index}-${nestLevel}`}
                                                    {...question.question}
                                                    position={index}
                                                    updateFunc={onUpdateDispatch}
                                                    level={nestLevel}
                                                    state={qdata.state}
                                                    dispatch={qdata.dispatch}
                                                    removeCondition={removeCondition}
                                                />
                                            )}
                                        </div>
                                        </>
                                        ))}
                                        
                                    </div>
                                )}
                        </Droppable>
                    </DragDropContext>

                </div>
            </div>
            {addValueVisible && <div style={{width: '100%', marginBottom: '4px'}}>
                <input className='addValueInput' type='text' placeholder='Insert value' value={newValueInput} onChange={(e) => setNewValueInput(e.target.value)} />
                <button className='greyButton'  onClick={() => addValue()}>Add</button>
            </div>}
        </div>
    );
};

export default Question;
