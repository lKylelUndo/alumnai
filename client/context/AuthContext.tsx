"use client"
import React, { createContext, useContext } from "react";

// as of now any lang sani siya ang holder sa auth context sa user
const AuthContext = createContext<any | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode}) {
    return (
        <AuthContext.Provider value={"test"}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (context === undefined)
        throw new Error("UseAuthContext must be used within an AuthProvider children components")
    return context;
}