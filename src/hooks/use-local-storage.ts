//It helps store and retrieve values from localStorage while syncing with React state automatically.

import { useEffect, useState } from "react"

/*<T> declares a generic type parameter named T.
initialValue: T means:
The parameter initialValue will have type T.
This T can be:
    a string
    a number
    an object
    an array
    any type you pass when using this hook.*/

const useLocalStorage = <T>(key: string, initialValue: T) => {

    const [storedValue, setStoredValue] = useState<T>(() => {
        try{
            //Looks in your browser's localStorage to see if a value exists for that key.
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
            //null if it doesnt exist json if exists
        }
        catch(error){
            console.error(error);
            return initialValue;
        }
        
    });

    //useEffect runs side effects in React.
    //This runs the code every time key or storedValue changes.
    useEffect(() => {
        try {
            //Converts your current state value (storedValue) into a JSON string.
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        }

        catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
    
}

export default useLocalStorage