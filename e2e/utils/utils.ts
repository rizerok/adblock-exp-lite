import { ElementHandle, Page } from 'puppeteer';

const escapeXpathString = (str: string): string => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};

export const getElementsByText = async (page: Page, text: string, tag: string): Promise<Array<ElementHandle<Element>>> => {
  const escapedText = escapeXpathString(text);
  return page.$x(`//${tag}[contains(text(), ${escapedText})]`) as Promise<Array<ElementHandle<Element>>>;
};
