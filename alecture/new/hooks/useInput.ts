import { Dispatch, SetStateAction, useCallback, useState, UIEvent } from 'react';

// const useInput = <T = any>(initData: T): [T, (e: UIEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>] => {
//   const [value, setValue] = useState(initData);
//   const handler = useCallback((e: UIEvent<HTMLInputElement>) => {
//     setValue(e.target.value);
//   }, []);

//   return [value, handler, setValue];
// };

// --- UIEvent<HTMLInputElement> 사용
// type ReturnTypes<T = any> = [T, (e: UIEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

// const useInput = <T = any>(initData: T): ReturnTypes => {
//   const [value, setValue] = useState(initData);
//   const handler = useCallback((e: UIEvent<HTMLInputElement>) => {
//     setValue(e.target.value);
//   }, []);

//   return [value, handler, setValue];
// };

// --- any 사용
type ReturnTypes<T = any> = [T, (e: any) => void, Dispatch<SetStateAction<T>>];

const useInput = <T = any>(initData: T): ReturnTypes => {
  const [value, setValue] = useState(initData);
  const handler = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);

  return [value, handler, setValue];
};

export default useInput;
