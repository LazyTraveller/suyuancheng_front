let select=function(data){
    
    if(data.indexOf("ADMINISTRATOR")>=0){
        return "ADMINISTRATOR"
        
        
    }else{
        if(data.indexOf("MARKET_MANAGER")>=0){
            return "MARKET_MANAGER"
        }else{
            return "STORE_MANAGER"
        }
    }
}
export default {select}