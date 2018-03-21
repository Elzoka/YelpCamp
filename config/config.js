process.env.NODE_ENV = process.env.NODE_ENV|| 'developement';

if(process.env.NODE_ENV === 'developement'){
    process.env.PORT = 3000;
}
