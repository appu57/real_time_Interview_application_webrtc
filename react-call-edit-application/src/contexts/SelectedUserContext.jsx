import React, { createContext, useContext, useEffect, useState } from 'react';
const SelectedUserContext = createContext();
export const useSelectedUserContext = () => {
    const selectedUserContext = useContext(SelectedUserContext);
    return selectedUserContext;

}

const SelectedUserContextProvider = ({ children }) => {
    const [selectedUserContext, setSelectedUserContext] = useState(null);
    return (
        <SelectedUserContext.Provider value={[selectedUserContext,setSelectedUserContext]}>
            {children}
        </SelectedUserContext.Provider>
    )
}
export default SelectedUserContextProvider;


// class solution{
//     public static void main(String[]args)
//     {
//       System.out.println('Hello')
//     }
//   }