export const fieldTypes = [
    {label: 'Multiple Options', id: 'multiple'},
    {label: 'Multiple Options and Other', id: 'multipleother'},
    {label: 'Yes / No (Radio Button)', id: 'yesno'},
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
    const randomNumber = Math.round(Math.random() * 500000);
    return `${randomNumber}`;
};
  
export const emptySection = {
    id: getUniqueKey(),
    label: '',
    question: '',
    type: 'multiple',
    values: [],
    answer: '',
};
