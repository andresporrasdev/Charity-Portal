# Charity Organization Portal

![Charity-Portal](https://github.com/andresporrasdev/Charity-Portal/blob/main/ReadmeFiles/HomePageReadme.jpg)

## Architectural Design

The backend also has logic for connecting to external services which OTS currently uses and would like to maintain. This includes EventBrite for creating events and collecting payment, and Gmail for sending and receiving emails to members. By connecting to these existing accounts for these services it will maintain a familiar experience for users.

Administrators and community organizers will also interact with the system primarily through the web portal as well, where they will have access to tools and dashboards allowing them access to the required database functionality. An administrator should not need to access the source code, or database directly except in the event of a system update or upgrade.

Users will interact with the product through a web page built using standard web technologies using the React Framework and connected to the backend via Node.js modules. The business logic is contained in the back end and written using Node.js. Here, the users’ requests are processed and packaged for the database

![Charity-Portal](https://github.com/andresporrasdev/Charity-Portal/blob/main/ReadmeFiles/Architectural_Design.jpg)

## Installation Instructions

For detailed installation and configuration instructions refer to the File **User Guide Charity** document, folder in root **ReadmeFiles**.

### Deploying the Website

This will depend on the hosting provider chosen, as each company will have specific tools and procedures for their product. Please consult any guides and tutorials provided by the hosting provider. All source code has been provided in a zip file and this can be directly uploaded to a hosting provider, or to an online git service depending on the client’s choice. For details on the files included in the source code see the “Program Design/Folder Structure” and Appendix A in this document.
Depending on the provider, you may need to build and start the portal – to do so;

1. Navigate to the “backend/” folder, and type npm install to install or update any required dependencies;
2. Type node server.js to start the backend service;
3. Navigate to the “frontend/” folder and type npm install to install or update any required dependencies; and
4. Type npm start to launch the front end / UI.

### Creating the Database

The database for the portal is MongoDB. There are two options for hosting the database, “self-hosting” using the same web-hosting service, or by using the MongoDB Atlas service. Official documentation for both options can be found at:

1. Self-Hosted MongoDB: https://www.mongodb.com/products/self-managed/community-edition
2. MongoDB Atlas: https://www.mongodb.com/atlas
   For development and testing, a free-tier Atlas cluster was used.
   Regardless of which hosting option is chosen, the following configuration steps should be the same:
3. Create a database
4. Find the MongoDB Connection String for your database (refer to MongoDB documentation for help: https://www.mongodb.com/docs/manual/reference/connection-string/)
5. Open the .env file located at backend/.env and enter the Connection String in the “MONGODB_URI=” field
6. Save the changes to the .env file.
7. When server.js is started (see “Deploying the Website” step 4) an empty database will be created at the cluster specified by the connection string.
8. When the database is created it will generate new, unique IDs for the roles. Navigate to the “roles” collection in the database and copy the unique IDs and paste them into frontend/.env by the corresponding variable.

### Configuration of external services

Setup of services as Everbrite API and Gmail API can be found in detail in the user guide in the ReadmeFiles folder

## Testing and Validation

For detailed reports on testing refer to the **Validation Report** document.

## Folder Structure

For details of the folder structure refer to the **Elaboration Report** document, section **Program Design / Folder Structure** and **Appendix A**.

| Reference | Folder Name  | Description                            |
| --------- | ------------ | -------------------------------------- |
| 1         | Project Root | Project Root                           |
| 1.1       | backend      | Backend, server code                   |
| 1.1.1     | controllers  | Logic for entities                     |
| 1.1.2     | data         | Sameple data for testing and debugging |
| 1.1.3     | models       | Entity models                          |
| 1.1.4     | node_modules | Auto-generated files from NodeJS       |
| 1.1.5     | routes       | React routers for fetching data.       |
| 1.1.6     | utils        | Utilities and helper files.            |
| 1.2       | frontend     | Frontend, user interface components    |
| 1.2.1     | node_modules | Auto-generated files from NodeJS       |
| 1.2.2     | public       | Images and media for main pages        |
| 1.2.3     | src          | source code for HTML, CSS, and JSX     |

## Credits

- Timothy Norman
- Iseul Park
- Parth Patel
- Andres Camilo Porras Becerra
- Binbin Yang
- Dunxing Yu
