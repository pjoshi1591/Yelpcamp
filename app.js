var express                = require("express"),
    app                    = express(),
    bodyParser             = require("body-parser"),
    mongoose               = require("mongoose"),
    Campground             = require("./models/campground"),
    compressor             = require("node-minify"),
    Comment                = require("./models/comment"),
    flash                  = require("connect-flash"),
    seedDB                 = require("./seeds"),
    passport               = require("passport"),
    methodOverride         = require("method-override"),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoose  = require("passport-local-mongoose"),
    User                   = require("./models/user");
    
    
var commentRoutes          = require("./routes/comments"),
    campgroundRoutes       = require("./routes/campgrounds"),
    indexRoutes            = require("./routes/index")
    
// seedDB();    
// mongoose.connect('mongodb://localhost:27017/yelp_camp_v11', { useNewUrlParser: true });
mongoose.connect('mongodb://pjoshi:pankaj15@ds113703.mlab.com:13703/yelp_camp',{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
mongoose.set("useCreateIndex", true);
app.use(flash());

app.locals.moment = require('moment');

//Passport Configuration
app.use(require("express-session")({
    secret: "This is the Secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelp Camp Server listening");
});