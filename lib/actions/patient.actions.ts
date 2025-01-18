"use server";

import { Query, ID } from "node-appwrite";
import { BUCKET_ID, 
         DATABASE_ID, 
         databases, 
         ENDPOINT, 
         PATIENT_COLLECTION_ID, 
         PROJECT_ID, 
         storage, 
         users } from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";



//Creating new user in Appwrite database
export const createUser = async (user: CreateUserParams) => {
   
    try {
       const newUser =  await users.create(             
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

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);  //create object from JSON string
  } catch (error) {
    console.log(error);
  }
};


export const registerPatient = async ({identificationDocument, ...patient}: RegisterUserParams) => {
 
   try {  //save identification document in app-write store
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(identificationDocument?.get("blobFile") as Blob,
                                             identificationDocument?.get("fileName") as string)
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);                                      
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: 
        `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient
      }
    );
    return newPatient;
    
   } catch (error) {
     console.log(error);
   }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [
        Query.equal("userId", userId)
      ]
    );
    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

