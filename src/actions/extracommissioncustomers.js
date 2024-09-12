import * as api from '../api';

export const extracommissioncustomers = (username) => async (dispatch) =>{
    try{
       const { data } = await api.extraCommission(username); //API CALL
       if( data?.response?.data?.message == 'Invalid token'){
         dispatch({ type: 'SIGNOUT'});     
       }else{
       dispatch({ type: 'EXTRA_COMMISSION_CUSTOMERS', data: data[0]});
       }
    }catch(error){
       console.log(error);
       if( error?.response?.data?.message == 'Invalid token'){
         dispatch({ type: 'SIGNOUT'});
       }
    }
}



