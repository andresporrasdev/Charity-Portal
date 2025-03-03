# Charity Organization Portal
## Live website link:
[Live functional website](https://charity-portal.onrender.com)
## Overview

The Charity Portal project aims to create an efficient and user-friendly platform to manage charitable organizations’ operations, including handling donations, events, and volunteer coordination. The portal is designed to streamline processes for both administrators and users, making it easier to track volunteers, participate in events, and engage with the organization.
The main objective of the project is to provide a robust and scalable platform for charities to manage their operations efficiently, improving donor engagement, and facilitating volunteer efforts while offering comprehensive reporting and transparency.

Key Features:
- User Management: Allows different types of users (e.g., administrators, performers, organizer, volunteers) to register and manage their profiles.
- Members Administration: Allow administrator to handle users in a table format
- Event Management: Offers a system to create, manage, and sign up (Assist or volunteers) for events organized by the charity.
- Volunteer Management: Enables the recruitment and management of volunteers, including tracking their involvement and contributions.
- News portal: Allow members and non members to get new filtered by role if logged
- Contact Form: Visitors can send a message throught a form and get a copy by mail of the data submited.

![Charity-Portal](https://raw.githubusercontent.com/andresporrasdev/Charity-Portal/main/ReadmeFiles/HomePageReadme.jpg)

## Architectural Design

Technologies Used:
- Front-End: React, HTML, CSS, JavaScript
- Back-End: Node.JS (Rest API for connecting Backend with FrontEnd with Express framework)
- Database: MongoDB
- Version Control: GitHub for version control and collaboration
- Security: Uses OTP (One Time Password) for submission, crypto to store passwords in DB, JWT (Jason Web Token) in login sessions
- PostMan: Test API requests and responses and Token and auth validation.
- External connections: EverBrite is used to create events and collect payment, Gmail used to send and receive emails to members.

![Charity-Portal](https://raw.githubusercontent.com/andresporrasdev/Charity-Portal/main/ReadmeFiles/Architectural_Design.jpg)

## Installation Instructions

For detailed installation and configuration instructions refer to the File **User Guide Charity** document, folder in root **ReadmeFiles**.

### Deploying the Website

This will depend on the hosting provider chosen, as each company will have specific tools and procedures for their product. Please consult any guides and tutorials provided by the hosting provider. All source code has been provided in a zip file and this can be directly uploaded to a hosting provider, or to an online git service depending on the client’s choice. For details on the files included in the source code see the “Program Design/Folder Structure” and Appendix A in this document.
Depending on the provider, you may need to build and start the portal – to do so;

1. Navigate to the “backend/” folder, and type npm install to install or update any required dependencies;
2. Type node server.js to start the backend service;
3. Navigate to the “frontend/” folder and type npm install to install or update any required dependencies; and
4. Type npm start to launching the front end / UI.

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
