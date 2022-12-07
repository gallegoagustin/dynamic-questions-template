export const fieldTypes = [
    {label: 'Multiple Options', id: 'multiple'},
    {label: 'Multiple Options and Other', id: 'multipleother'},
    {label: 'Yes / No', id: 'yesno'},
    {label: 'Text Input', id: 'text'},
]

export const yesNoTypes = [
    {
        value: 'Yes',
        conditional: false,
        question: null,
        order: 0,
    },
    {
        value: 'No',
        conditional: false,
        question: null,
        order: 1,
    }
]

export const getUniqueKey = (initializer) => {
    const randomNumber = Math.round(Math.random() * 100000);
    return `${initializer}-${randomNumber}`;
};
  
export const emptySection = {
    id: getUniqueKey(0),
    label: '',
    question: '',
    type: 'multiple',
    values: [],
    answer: '',
};
