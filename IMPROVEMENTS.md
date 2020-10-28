# IMPROVEMENTS

- Add search bar based on body, subject, and address of emails.
- Add tooltip containing full email address for emails with too long length.
- Add pagination for the email list in case we have too many emails.
- Add Purge CSS for removing unused bootstrap CSS codes.
- Add cache to formatEmails function (src/app.vue) by using closure if we had too many emails. like this: 

 ```javascript
 function generateFormatEmails(){
     const cache = {}
     return function(){
         //...
     }
 }
 const formatEmails = generateFormatEmails()
 ```