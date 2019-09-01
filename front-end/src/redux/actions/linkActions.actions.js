import uuidv4 from "uuid/v4";
import API from "../../api";

export const UPDATE_LINK = "UPDATE_LINK";
export const UPDATE_TITLE = "UPDATE_TITLE";
export const CREATE_LINK = "CREATE_LINK";
export const SELECT_LINK = "SELECT_LINK";

export const updateLink = link => {
  return dispatch => {
    dispatch({
      type: UPDATE_LINK,
      payload: { link: link }
    });
  };
};

export const updateTitle = title => {
  console.log("Updating Title");
  console.log(title);
  return dispatch => {
    dispatch({
      type: UPDATE_TITLE,
      payload: { title: title }
    });
  };
};

// export const createLink = history => {
//   return (dispatch, getState) => {
//     const currentState = getState().Link;
//     dispatch({
//       type: CREATE_LINK,
//       payload: {
//         id: uuidv4(),
//         link: currentState.link,
//         title: currentState.title,
//         date: new Date().toGMTString(),
//         data: []
//       }
//     });
//   };
// };

export const createLink = history => {
  return (dispatch, getState) => {
    const currentState = getState().Link;
    const data = {
      id: uuidv4(),
      link: currentState.link,
      title: currentState.title,
      date: new Date().toGMTString(),
      data: []
    };

    API.post("/api/link", data).then(result => {
      console.log(result);
      // dispatch({
      //   type: CREATE_LINK,
      //   payload: data
      // });
      history.push("/view");
    });
  };
};

export const selectLink = (history, id, link, title, date, data) => {
  return dispatch => {
    dispatch({
      type: SELECT_LINK,
      payload: {
        id,
        link,
        title,
        date,
        data
      }
    });
    history.push("/view");
  };
};
