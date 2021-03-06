/*
 *
 * this is the saga file that handles the external api requests
 * in referece to the logic based in the "linksActions.actions.ts"
 * file
 *
 */
import {all, takeEvery, put, call} from 'redux-saga/effects';
import API from '../../api';
import {
  GET_LINKS,
  DELETE_LINK,
  getLinksSuccess,
  deleteLinkSuccess,
} from './linksActions.actions';

const onLinkRequest = (userId: string) => {
  const request = API.get(`/api/links/${userId}/`);
  return request;
};

export function* getLinksAsync({payload}: any) {
  const {userId} = payload;

  const request = yield call(onLinkRequest, userId);

  const result: any = request.data.sort(
    (a: any, b: any): any =>
      new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  yield put(getLinksSuccess(result));
}

const onDeleteLinkRequest = (linkId: string) => {
  const request = API.delete(`/api/link/delete/${linkId}/`);
  return request;
};

export function* deleteLinkAsync({payload}: any) {
  const {linkId, history} = payload;

  yield call(onDeleteLinkRequest, linkId);

  yield put(deleteLinkSuccess(history));
}

/* 
  Saga Watcher
*/
export default function* rootSaga() {
  yield all([
    takeEvery(GET_LINKS, getLinksAsync),
    takeEvery(DELETE_LINK, deleteLinkAsync),
  ]);
}
