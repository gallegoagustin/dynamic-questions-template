export const fieldTypes = [
    {label: 'Multiple Options', id: 'multiple'},
    {label: 'Multiple Options and Other', id: 'multipleother'},
    {label: 'Yes / No (Radio Button)', id: 'yesno'},
    {label: 'Yes / No / NA', id: 'yesnona'},
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

export const yesNoNaTypes = [
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
    },
    {
        value: 'No Answer',
        conditional: false,
        question: null,
        order: 2,
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
    type: fieldTypes[0].id,
    values: [],
    answer: '',
    has_gallery: true,
    gallery: [],
};
