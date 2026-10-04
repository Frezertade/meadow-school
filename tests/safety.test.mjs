import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './lib/register.mjs';

const { isUnsafeChildInput, sanitizeTutorOutput, REDIRECT } = await import('@/lib/agent/safety');

describe('isUnsafeChildInput', () => {
  it('flags violent, adult, and personal-data topics', () => {
    for (const bad of [
      'how to make a bomb',
      'i hate you',
      'what is your password',
      'where do you live',
      'come over to my house',
    ]) {
      assert.equal(isUnsafeChildInput(bad), true, bad);
    }
  });
  it('passes ordinary lesson talk', () => {
    for (const ok of ['i like cats', 'help me count', 'that was fun', 'say it again']) {
      assert.equal(isUnsafeChildInput(ok), false, ok);
    }
  });
});

describe('sanitizeTutorOutput', () => {
  it('redirects output containing blocked topics', () => {
    assert.equal(sanitizeTutorOutput('a gun is dangerous'), REDIRECT);
  });
  it('strips URLs but keeps the lesson text', () => {
    const out = sanitizeTutorOutput('Great counting! See https://example.com for more');
    assert.ok(!out.includes('https://'));
    assert.ok(out.includes('Great counting!'));
  });
  it('redirects when nothing safe remains', () => {
    assert.equal(sanitizeTutorOutput('https://example.com'), REDIRECT);
  });
  it('leaves clean output untouched', () => {
    assert.equal(sanitizeTutorOutput('Yes! That is right.'), 'Yes! That is right.');
  });
});
