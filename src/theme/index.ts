import { createEvent, createStore, sample } from "effector";

export enum Theme {
    Dark,
    Light
};

export const themeToggled = createEvent();

export const $theme = createStore<Theme>(Theme.Light);

sample({
  clock: themeToggled,
  source: $theme,
  fn: (theme) => (theme === Theme.Dark ? Theme.Light : Theme.Dark),
  target: $theme
});
