import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('./styles.css', import.meta.url), 'utf8');

test('the quote summary stays in view while configuring on desktop', () => {
 const summaries = [...css.matchAll(/\.summary\s*\{([^}]*)\}/gs)].map(match => match[1]).join(' ');
 assert.match(summaries, /position\s*:\s*sticky/);
});

test('keyboard users get a visible focus indicator on links and form controls', () => {
 assert.match(css, /:where\(a,button,textarea\):focus-visible[\s\S]*?outline\s*:/);
 assert.match(css, /input:focus-visible[\s\S]*?outline\s*:/);
 assert.match(css, /select:focus-visible[\s\S]*?outline\s*:/);
});

test('the quote summary returns to normal flow on narrow screens', () => {
 assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*?position\s*:\s*static/);
});
