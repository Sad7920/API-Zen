import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const updateKeyValue = (e, index, state, setState, field) => {
  const newState = [...state];
  newState[index][field] = e.target.value;
  setState(newState);
};
