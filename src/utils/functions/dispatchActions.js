// dispatchActions.js
export const dispatchAction = (dispatch, type, payload) => {
    console.log(payload)
    dispatch({
      type: type,
      payload: payload
    });


      setTimeout(() => {
        dispatch({
          type:type,
          payload:false
        })
      }, 2500);
    
  };
  