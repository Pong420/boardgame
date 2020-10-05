import { JSDOM } from 'jsdom';
import * as createDOMPurify from 'dompurify';

const window: Window = new JSDOM('').window as any;
export const DOMPurify = createDOMPurify(window);
