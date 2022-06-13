const express = require("express")
const path = require("path")
const multer = require("multer")
const app = express()
	
// View Engine Setup
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
	
let storage = multer.diskStorage({
	destination: function (req, file, cb) {

		// Uploads is the Upload_folder_name
		cb(null, "uploads")
	},
	filename: function (req, file, cb) {
	cb(null, file.fieldname + "-" + Date.now()+".jpg")
	}
})
	
// Define the maximum size for uploading
// picture i.e. 3MO/24MB. it is optional
const maxSize = 24 * 1000 * 1000;
	
let upload = multer({
	storage: storage,
	limits: { fileSize: maxSize },
	fileFilter: function (req, file, cb){
	
		// Set the filetypes, it is optional
		let filetypes = /png/;
		let mimetype = filetypes.test(file.mimetype);

		let extname = filetypes.test(path.extname(
					file.originalname).toLowerCase());
		
		if (mimetype && extname) {
			return cb(null, true);
		}
	
		cb("Error: File upload only supports the "
				+ "following filetypes - " + filetypes);
	}

// mypic is the name of file attribute
}).array("mypic");	

app.get("/",function(req,res){
	res.render("Signup");
})
	
app.post("/monupload",function (req, res, next) {
		
	// Error MiddleWare for multer file upload, so if any
	// error occurs, the image would not be uploaded!
	upload(req,res,function(err) {

		if(err) {

			// ERROR occurred (here it can be occurred due
			// to uploading image of size greater than
			// 3MO or uploading different file type)
			res.send(err)
		}
		else {

			// SUCCESS, image successfully uploaded
			res.send("Success, Images uploaded!")
		}
	})
})
	
// Take any port number of your choice which
// is not taken by any other process
app.listen(8080,function(error) {
	if(error) throw error
		console.log("Server created Successfully on PORT 8080")
})
