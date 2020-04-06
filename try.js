let a = 1;

const sayHi = _ => {
    console.log('Hi');
};

const sayBye = _ => {
    console.log('Bye');
};

a === 2 ? sayHi() : sayBye();