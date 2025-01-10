"use server"

import { Query, ID } from "node-appwrite";
import { users } from "../appwrite.config";



//Creating new user in Appwrite database
export const createUser = async (user: CreateUserParams) => {
   
    try {
       const newUser =  await users.create(  //here is error            
         ID.unique(), 
         user.email, 
         user.phone, 
         undefined,   
         user.name ); 
         return newUser;     
    } catch (err: any) {
      if( err && err?.code === 409 ) {  //such a user exists
            const documents = await users.list([
            Query.equal("email", [user.email])]);
            return documents?.users[0];       
      } 
      console.error("An error occurred while creating a new user:", err);
   } 
}; 