/*
 *
 * this is the file that handles the redux reducer for all the create link logic
 *
 */
import {
  UPDATE_LINK,
  UPDATE_TITLE,
  CREATE_LINK,
  CREATE_LINK_SUCCESS,
} from '../actions/createActions.actions';

const initialState = {
  id: '',
  redirectURL: '',
  userId: '',
  link: '',
  title: '',
  date: '',
  analytics: [],
};

export default (state = initialState, {type, payload}: any) => {
  switch (type) {
    case UPDATE_LINK:
      return {...state, link: payload.link};
    case UPDATE_TITLE:
      return {...state, title: payload.title};
    case CREATE_LINK:
      return {
        ...state,
        id: payload.id,
        link: payload.link,
        title: payload.title,
        date: payload.date,
        analytics: payload.analytics,
      };
    case CREATE_LINK_SUCCESS:
      return {
        ...state,
        id: payload.id,
        link: payload.link,
        title: payload.title,
        date: payload.date,
        analytics: payload.analytics,
      };
    default:
      return state;
  }
};
