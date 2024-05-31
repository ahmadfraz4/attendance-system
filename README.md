Attendance Management System 📅 using ( MERN ). 🍃
How to run project on local system:
1-Make Sure U have mongodb installed in your system.
2-Open project and go to conn.js file using following path :- src/database/conn.js .
3-Replace ( process.env.MONGOURI ) by your local mongodb uri.

4-Open Project's Root directory & type following commands :-
- npm install
- npm run dev
5-Open Browser and enter this localhost url : localhost:3000

Description of Project :
# Students Can mark attendance after login & can see their previous attendances. Once a student mark his/her attendance , They can't mark it again till Next Day . Students can send Leave Requests to Admin.

# Admin Panel : Admin can ( Add, Delete, & Update Student's id )
Admin can check previous attendance of Student & Can filter out attendance percentage by entering 2 random dates ( FROM - TO ). Admin can create full Attendance report of any Student & can approve or reject the Student Leave Request.
