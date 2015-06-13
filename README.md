# SP-Client-Side-Template
The SP Client Side template is a starter project for writing No Code Sandbox Solutions for SharePoint 2013 and SharePoint Online.  It includes examples for:
* Using module patterns to load JavaScript files and defined dependencies.
* React.js for building client side web parts
* Using Node.js for JavaScript and CSS build automation

## Getting Started
To get started with the project you will need:
* Visual Studio 2013
* Node.js (https://nodejs.org/)
  * After installing Node.js open a Node command prompt and run the following commands to install the React and Grunt command line tools:
    * npm install grunt -g (documentation: https://www.npmjs.com/package/grunt) 
    * npm install react-tools -g (documentation: https://www.npmjs.com/package/react-tools) 
  * (Optional) GitHub for Windows: https://windows.github.com/ 
    * Simplifies cloning GitHub repositories
* Clone the GitHub repository to your local machine
* From within the Node.js command prompt, navigate to the directory containing the AL.Core.SharePoint.Web project.
  * Run: npm install
    * This command reads the npm dependencies from the file package.json and downloads them to the current directory
