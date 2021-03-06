/*
 *
 * this is the file that handles the typescript interfaces for all link actions
 *
 */
import {
  GET_LINKS,
  GET_LINKS_SUCCESS,
  DELETE_LINK,
  DELETE_LINK_SUCCESS,
} from '../../redux/actions/linksActions.actions';
import {Link} from './link';

export interface getLinksInterface {
  type: typeof GET_LINKS;
  payload: {
    userId: string;
  };
}

export interface getLinksSuccessInterface {
  type: typeof GET_LINKS_SUCCESS;
  payload: {
    links: Link[];
  };
}

export interface deleteLinkInterface {
  type: typeof DELETE_LINK;
  payload: {
    linkId: string;
    history: any;
  };
}

export interface deleteLinkSuccessInterface {
  type: typeof DELETE_LINK_SUCCESS;
  payload: {
    id: string;
    redirectURL: string;
    userId: string;
    link: string;
    title: string;
    date: string;
    analytics: [];
  };
}

export type LinksActionTypes =
  | getLinksInterface
  | getLinksSuccessInterface
  | deleteLinkInterface
  | deleteLinkSuccessInterface;
