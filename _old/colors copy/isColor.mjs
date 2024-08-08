export const isColor = (value) => {
  return isString(value) && value.match(/^(#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i);
}