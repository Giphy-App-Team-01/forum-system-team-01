import { MIN_CONTENT_CHARS } from '../common/constants';
export const validatePostContent = (content) =>
  content.length >= MIN_CONTENT_CHARS;
