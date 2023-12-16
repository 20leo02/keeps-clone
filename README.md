#keeps-clone

Simple fullstack Google Keeps clone utilizing React.js on the frontend, Node.js (Express.js) on the backend, and an AWS RDS instance to store my database.

Functionalities include adding and deleting Notes. As such, the database included only a single table, Notes, consisting of a primary key nid, as well as title and content of a Note. Node pg was used to make queries to the databse on the backend.

The original plan was to deploy this application on AWS, hence the RDS instance, but I didn't have enough time to learn how to do it. Hope to be able to do that over the break, if for nothing more than to learn to deploy future fullstack projects.
