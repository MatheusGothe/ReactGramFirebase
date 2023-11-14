// errorActions.js
export const setErrorWithTimeout = (dispatch) => {

    setTimeout(() => {
      dispatch({
        type: "SET_ERROR",
        payload: false
      });
    }, 3000);
  };
  