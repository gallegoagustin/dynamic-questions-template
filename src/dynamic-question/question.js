import { useEffect, useState } from 'preact/hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fieldTypes, yesNoTypes, yesNoNaTypes, emptySection } from './utils.js';

const production = false;

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

    const handleFieldTypeChange = (value) => {
        const newdq = {...questionData, type: value};
        if (value === 'yesno') newdq.values = [...yesNoTypes];
        if (value === 'yesnona') newdq.values = [...yesNoNaTypes];
        if (value === 'text') newdq.values = [];
        setQuestionData(newdq);
        questionData.updateFunc(newdq, questionData.position);
    };

    const handleGalleryChange = (value) => {
        const newdq = {...questionData};
        newdq.has_gallery = value;
        setQuestionData(newdq);
        questionData.updateFunc(newdq, questionData.position);
    };
   
    const addQuestion = (valuePos) => {
        qdata.dispatch({type: 'SET_NEST_VALUE_ACTIVE', payload: null});
        const newdq = {...questionData, values: [ ...questionData.values ]};
        newdq.values[valuePos] = {
            ...newdq.values[valuePos],
            conditional: true,
            question: {...emptySection}
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
        qdata.dispatch({type: 'SET_NEST_VALUE_ACTIVE', payload: nestLevel});
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
        qdata.dispatch({type: 'SET_NEST_VALUE_ACTIVE', payload: nestLevel});
        questionData.updateFunc(newData, questionData.position);
    };
  
    const handleMainQuestion = (value) => {
        const newData = {...questionData, question: value};
        setQuestionData(newData);
        qdata.dispatch({type: 'SET_NEST_VALUE_ACTIVE', payload: nestLevel});
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
    };

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
    }, [qdata.state.nestLevelActiveValue]);

    useEffect(() => {
        if (nestLevel > 1 && questionData.label.length > 0) setNewQuestionVisible(false);
        if (nestLevel === 1 && questionData.question.length > 0) setNewQuestionVisible(false);
    }, [questionData.label]);
    // END DATA CHANGES LISTENERS

    if (newQuestionVisible) return (
        <div className={'addValueContainer'} style={qdata.level === 0 ? {maxWidth: '100%', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'} : {maxWidth: '100%', marginBottom: '4px', marginLeft: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
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
                onClick={(e) => {
                    e.preventDefault();
                    if (nestLevel > 1) handleLabel(newQuestionInput);
                    if (nestLevel === 1) handleMainQuestion(newQuestionInput);
                }}
                style={{marginTop: '8px'}}
            >Add</button>
        </div>
    );
  
    return (
        <div className={qdata.level === 0 ? 'containerQuestion' : 'captionQuestion'}>
            <div>
                <div className={!inputActive.question ? 'headerQuestion commonSpace' : 'headerQuestionActive commonSpace'} style={qdata.level !== 0 ? {marginTop: '3px'} : null}>
                    {qdata.level === 0 && <input disabled={!inputActive.question} type='text' placeholder={'Insert question'} value={inputRecord.question} name='' onChange={(e) => setInputRecord({...inputRecord, question: e.target.value})} />}
                    {qdata.level !== 0 && <input disabled={!inputActive.label} type='text' placeholder={'Insert question'} value={inputRecord.label} name='' onChange={(e) => setInputRecord({...inputRecord, label: e.target.value})} />}                 
                    <div className='commonSpace-buttons'>
                        <select
                            className='fieldTypeSelection no-default-select2'
                            onChange={(e) => {
                                e.preventDefault();
                                handleFieldTypeChange(e.target.value);
                            }}
                        >
                            {fieldTypes.map(el => (<option selected={el.id === questionData.type} value={el.id}>{el.label}</option>))}
                        </select>
                        {qdata.level === 0 && !inputActive.question && <div
                            className='pointer'
                            onClick={(e) => {
                                e.preventDefault();
                                toggleActiveInputs('question');
                            }}><img src={production ? '/static/img/icons/pen-white.svg' : './dynamic-question/assets/pen-white.svg'} /></div>}
                        {qdata.level === 0 && inputActive.question && <div className='pointer' onClick={(e) => {
                            e.preventDefault();
                            handleMainQuestion(inputRecord.question);
                            setInputActive({...inputActive, question: false});
                        }}><img src={production ? '/static/img/icons/save-white.svg' : './dynamic-question/assets/save-white.svg'} /></div>}
                        {qdata.level !== 0 && !inputActive.label && <div
                            className='pointer'
                            onClick={(e) => {
                                e.preventDefault();
                                toggleActiveInputs('label');
                            }}><img src={production ? '/static/img/icons/pen-white.svg' : './dynamic-question/assets/pen-white.svg'} /></div>}
                        {qdata.level !== 0 && inputActive.label && <div className='pointer' onClick={(e) => {
                            e.preventDefault();
                            handleLabel(inputRecord.label);
                            setInputActive({...inputActive, label: false});
                        }}><img src={production ? '/static/img/icons/save-white.svg' : './dynamic-question/assets/save-white.svg'} /></div>}
                        {questionData.type !== 'yesno' && questionData.type !== 'yesnona' && questionData.type !== 'text' ? <div>
                            <img
                                src={production ? '/static/img/icons/plus-white.svg' : './dynamic-question/assets/plus-white.svg'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    qdata.dispatch({type: 'SET_NEST_VALUE_ACTIVE', payload: nestLevel});
                                    questionData.updateFunc(newdq, questionData.position);
                                }}
                                style={qdata.state.nestLevelActiveValue === nestLevel ? 'cursor: not-allowed' : ''}
                            />
                        </div> : null}
                        {qdata.level !== 0 && !inputActive.label && <div
                            className='pointer'
                            onClick={(e) => {
                                e.preventDefault();
                                qdata.removeCondition(qdata.position);
                            }}><img src={production ? '/static/img/icons/trash-white.svg' : './dynamic-question/assets/trash-white.svg'} /></div>}
                        {/* <div
                            style={{width: '20px', height: '20px', backgroundColor: '#FFF', borderRadius: '50%'}}
                            onClick={() => {
                                const newValue = questionData.has_gallery ? false : true;
                                handleGalleryChange(newValue);
                            }}
                        ></div> */}
                        {qdata.level === 0 && <div style={{width: '32px'}}></div>}
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
                                    {questionData.type === 'text' ? <div className={'evenRow commonSpace'}>
                                        <input 
                                            disabled={true}
                                            type='text'
                                            placeholder='Free Text'
                                            name='value'
                                            style={{width: '85%', maxWidth: 'none'}}
                                            className={'editValueInput'}
                                            maxLength={500}
                                        />
                                    </div> : null}
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
                                                                <div style={{width: '5%'}}><img src={production ? '/static/img/icons/drag-grey.svg' : './dynamic-question/assets/drag-grey.svg'} /></div>
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
                                                                    style={{width: '85%', maxWidth: 'none'}}
                                                                    className={!inputActive.values[index] ? 'editValueInput' : 'editValueInputActive'}
                                                                />
                                                                <div className='commonSpace-buttons' style={{width: '10%'}}>
                                                                    {nestLevel <= 2 && !question.conditional && (
                                                                        <div
                                                                            style={{ marginRight: '3px' }}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                addQuestion(index);
                                                                            }}><img src={production ? '/static/img/icons/plus-grey.svg' : './dynamic-question/assets/plus-grey.svg'} /></div>
                                                                    )}
                                                                    {!inputActive.values[index] && <div
                                                                        style={{ marginRight: '3px' }}
                                                                        disabled={qdata.state.isEditing}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            const newValues = inputActive.values.map(() => false);
                                                                            newValues[index] = true;
                                                                            toggleActiveInputs('values', newValues);
                                                                        }}><img src={production ? '/static/img/icons/pen-grey.svg' : './dynamic-question/assets/pen-grey.svg'} />
                                                                    </div>}
                                                                    {inputActive.values[index] && <div
                                                                        style={{ marginRight: '3px' }}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            handleValueLabel(inputRecord.values[index], index);
                                                                            const newValues = [...inputActive.values];
                                                                            newValues[index] = false;
                                                                            setInputActive({...inputActive, values: newValues});
                                                                        }}><img src={production ? '/static/img/icons/save-grey.svg' : './dynamic-question/assets/save-grey.svg'} />
                                                                    </div>}
                                                                    <div
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            removeValue(index);
                                                                        }}
                                                                        style={{ marginRight: '3px' }}><img src={production ? '/static/img/icons/trash-grey.svg' : './dynamic-question/assets/trash-grey.svg'} /></div>
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
                                    {questionData.type === 'multipleother' ? <div className={'evenRow commonSpace'}>
                                        <div style={{width: '5%'}}><img src={production ? '/static/img/icons/drag-light-gray.svg' : './dynamic-question/assets/drag-light-gray.svg'} /></div>
                                        <input 
                                            disabled={true}
                                            type='text'
                                            value='Free Text'
                                            name='value'
                                            style={{width: '95%', maxWidth: 'none'}}
                                            className={'editValueInput'}
                                            maxLength={500}
                                        />
                                    </div> : null}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                </div>
            </div>
            {addValueVisible && questionData.type !== 'yesno' && questionData.type !== 'yesnona' && questionData.type !== 'text' ? <div className={'addValueContainer'} style={{width: '100%', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <input className='addValueInput' type='text' placeholder='Insert value' value={newValueInput} onChange={(e) => setNewValueInput(e.target.value)} />
                <button
                    disabled={!newValueInput.length}
                    className='greyButton'
                    onClick={(e) => {
                        e.preventDefault();
                        addValue();
                    }}
                    style={{marginTop: '8px'}} >Add</button>
            </div> : null}
        </div>
    );
};

export default Question;