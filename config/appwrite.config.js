import { Client, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)

const appwriteStorage = new Storage(client);

export default appwriteStorage;