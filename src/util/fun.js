
const fun={}
fun.setLocalStorage=(name,value)=>{
    let type=typeof value;
    if(type=='object'){
        let jsonValue=JSON.stringify(value)
        window.localStorage.setItem(name,jsonValue)
    }else if(['string','number','boolean'].indexOf(type)>=0){
        window.localStorage.setItem(name,value)
    }else{
        return 
    }
}
fun.getLocalStorage=(name)=>{
    let value=window.localStorage.getItem(name);
    return value
    // return JSON.parse(value)
}
fun.removeLocalStorage=(name)=>{
    return window.localStorage.removeItem(name);
}
export default fun