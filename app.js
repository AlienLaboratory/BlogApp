let express = require("express");
let app = express();
let bParser = require("body-parser");
let mongoose = require("mongoose");
let methodOverride = require("method-override");
let expressSanitizer = require("express-sanitizer");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//testing goes here
//const username = process.argv[2].split('=')[1];
//console.log(`Hello, ${username}`);

const connectionString ="mongodb+srv://Oleksandr:ecu3ador4@oleksandr-mongo-qa3k0.gcp.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(connectionString,{useUnifiedTopology:true,useNewUrlParser:true});

let blogSchema = mongoose.Schema(
	{
		title : String,
		image : String,
		body  : String,
		created : {type:Date,default:Date.now()}
	}
		);
	//Mongoose model config
	let Blog = mongoose.model("Blog",blogSchema);
/* works with Atlas mongoDB cloud!
	Blog.create(
		{
			title:"firstBlog",
			image: "https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
			body : "Hello from BODY"
	
		});
*/

//testing ends here

/*
mongoose.connect("mongodb://localhost/blogDB",{useUnifiedTopology:true,useNewUrlParser:true});

//blog Schema title image body created

let blogSchema = mongoose.Schema(
{
	title : String,
	image : String,
	body  : String,
	created : {type:Date,default:Date.now()}
}
	);
//Mongoose model config
let Blog = mongoose.model("Blog",blogSchema);


*/
/*
//connect to Atlas - mongoDB cloud 
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://Oleksandr:ecu3ador4@oleksandr-mongo-qa3k0.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });
client.connect(err => {
	const collection = client.db("test").collection("devices");
	console.log("Connected, collection: "+collection);
	console.log("testing");
  // perform actions on the collection object
  client.close();
});
*/



/*
Blog.create(
	{
		title:"firstBlog",
		image: "https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		body : "Hello from BODY"

	});
*/
//Restful routes
app.get("/",function(req,res){
	res.redirect("/blogs");
});
//index route
app.get("/blogs",function(req,res){
	
	Blog.find({},function(err,blogs){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("index",{blogs:blogs});
		}
		})
	
});

//post route

app.post("/blogs" , function(req,res)
{
	
	req.body.blog.body = req.sanitize(req.body.blog.body);

	Blog.create(req.body.blog , function(err,newBlog)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/blogs");
		}
	});
});

// Create route (New Route)

app.get("/blogs/new",function(req,res)
	{
		res.render("new");
	});
// show route


app.get("/blogs/:id",function(req,res){

	//console.log("test: "+req.params.id);
	
	Blog.findById(req.params.id,function(err,found)
	{
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.render("show",{blog:found});
		}
	})
});

//edit route (sort of combination of new and show routes)
app.get("/blogs/:id/edit",function(req,res)
{
	Blog.findById(req.params.id,function(err,foundBlog)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("edit",{blog:foundBlog});
		}
	});
	
});

// update route
app.put("/blogs/:id",function(req,res)
{

	req.body.blog.body = req.sanitize(req.body.blog.body);

	Blog.findByIdAndUpdate(req.params.id, req.body.blog ,function(err,updated)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/blogs/" + req.params.id);
		}
	})
});
//delete route
app.delete("/blogs/:id",function(req,res)
{
Blog.findByIdAndRemove(req.params.id,function(err,blog)
{
	if(err)
	{
		res.redirect("/blogs");
	}
	else
	{
		res.redirect("/blogs");
	}
});
});


app.listen(8880,function () {
console.log("Server 8880 is running");
});