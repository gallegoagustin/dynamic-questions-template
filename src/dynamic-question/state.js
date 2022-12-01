import { emptySection } from "./utils.js";

export const initialState = {
    data: [{...emptySection}],
    isEditing: false,
    nestLevelActiveValue: 1,
};
  
export const reducer = (state, action) => {
    switch (action.type) {
    case 'UPDATE_STATE':
        var part1 = [...state.data].slice(0, action.payload.index);
        var part2 = [...state.data].slice(action.payload.index + 1, state.data.length - action.payload.index + 1);
        var dataToInsert = action.payload.data;
        var newState = [...part1, dataToInsert, ...part2];
        return {
            ...state,
            data: newState,
        };
    case 'NEW_SECTION':
        return {
            ...state,
            data: [...state.data, {...emptySection}],
        };
    case 'DELETE_SECTION':
        var deletePart1 = [...state.data].slice(0, action.payload);
        var deletePart2 = [...state.data].slice(action.payload + 1, state.data.length - action.payload + 1);
        var finalDeleteArr = [...deletePart1, ...deletePart2];
        return {
            ...state,
            data: finalDeleteArr,
        };
    case 'IS_EDITING':
        return {
            ...state,
            isEditing: true,
        };
    case 'IS_NOT_EDITING':
        return {
            ...state,
            isEditing: false,
        };
    case 'SET_NEST_VALUE_ACTIVE':
        return {
            ...state,
            nestLevelActiveValue: action.payload,
        };
    default: 
        return state;
    }
};