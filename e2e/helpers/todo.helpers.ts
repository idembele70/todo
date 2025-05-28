import { fakerFR } from '@faker-js/faker';
import { GenerateContentOptions } from '../types/todo.types';

/**
 * Generates an array of fake todo contents.
 *
 * @param count Number of contents to generate.
 * @param options Option config: wordCount per sentence.
 */
export const generateRandomContents = (count: number, options?: GenerateContentOptions): string[] => {
  const wordCount = options?.wordCount ?? 2;
  return Array.from({ length: count }).map(() => fakerFR.lorem.sentence(wordCount));
};
