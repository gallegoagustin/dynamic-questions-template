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
};
