const CAPTCHA_LENGTH = 5;
const CAPTCHA_DIGITS = '23456789';

export function createCaptchaCode() {
  const randomValues = new Uint32Array(CAPTCHA_LENGTH);

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    for (let index = 0; index < CAPTCHA_LENGTH; index += 1) {
      randomValues[index] = Math.floor(Math.random() * 100000);
    }
  }

  return Array.from(
    randomValues,
    (value) => CAPTCHA_DIGITS[value % CAPTCHA_DIGITS.length]
  ).join('');
}
