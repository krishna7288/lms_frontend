const express = require("express");
const app = express();
const connectDB = require("./common/dbConnect");
const cors = require("cors");

connectDB();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false}));

//imported Routes
const superadminRoute = require("./routes/SuperadminRoute");
const loginAuthRoute = require('./routes/LoginAuthRoute');
const adminRoute = require("./routes/AdminRoute");
const instituteRoute = require("./routes/InstituteRoute");
const elibraryRoute = require("./routes/ELibraryRoute");
const branchRoute = require("./routes/BranchRoute");
const facultyRoute = require("./routes/FacultyRoute");
const CourseAdditionRoute=require("./routes/CourseAdditionRoute");
const batch=require("./routes/BatchRoute");
const studentRoute=require("./routes/StudentRoute");
const instituteAdminRoute=require("./routes/InstituteAdminRoute");
const supportFormRoute=require("./routes/SupportFormRoute");
const branchAdminRoute=require("./routes/BranchAdminRoute");
const subjectRoute = require('./routes/SubjectRoute');

//Routes
app.use("/api", superadminRoute);
app.use("/api/auth", loginAuthRoute);

app.use("/api", adminRoute);
app.use("/adminuploads", express.static("public/AdminUploads"));

app.use("/api", instituteRoute);
app.use("/instituteuploads", express.static("public/InstituteUploads"));

app.use("/api", elibraryRoute);
app.use("/elibraryuploads", express.static("public/ELibraryUploads"));

app.use("/api", branchRoute);
app.use("/Branchuploads", express.static("public/BranchUploads"));

app.use("/api", facultyRoute);
app.use("/Facultyuploads", express.static("public/FacultyUploads"));

app.use("/api", CourseAdditionRoute);

app.use("/api",batch);
app.use("/Batchuploads", express.static("public/BatchUploads"));

app.use("/api", studentRoute);
app.use("/Studentuploads", express.static("public/StudentUploads"));

app.use("/api", instituteAdminRoute);
app.use("/InstituteAdminUploads", express.static("public/InstituteAdminUploads"));

app.use("/api", supportFormRoute);
app.use("/SupportFormUploads", express.static("public/SupportFormUploads"));

app.use("/api", branchAdminRoute);
app.use("/BranchAdminUploads", express.static("public/BranchAdminUploads"));

app.use("/api", subjectRoute); // Include SubjectRoute
app.use("/NotesUploads", express.static("public/NotesUploads"));

app.use((req, res, next) => {
  res.send(
    "<h1>404 Page not found check the URL you have entered correctly</h1>"
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {  
  console.log(`Server is running on port ${PORT}`);
});
