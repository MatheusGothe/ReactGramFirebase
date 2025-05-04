// dispatchActions.js
export const dispatchAction = (dispatch, type, payload) => {
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
  