const userModel = require("../models/user.model")

const jwt  = require("jsonwebtoken")



async function userRegisterController(req, res){
      console.log("REGISTER CONTROLLER HIT");

    

    const {email , password , name} = req.body

    console.log("BODY:", req.body);

    const isExists = await userModel.findOne({
        email:email
    })
       console.log("DATABASE QUERY COMPLETED");

    if(isExists){
        return res.status(422).json({
            message:"user Already exists with  this email",
            status:"failed"
        })

    }


    const user  = await userModel.create({
        email, password, name
    })

    const token = jwt.sign({userId:user._id} , process.env.JWT_SECRET ,{expiresIn:"3d"})

    res.cookie("token", token)

    res.status(201).json({

        user:{
            _id:user._id,
            email:user.email,

            name:user.name

        },

        token

    })

}



//  user login controller
// -post/api/auth/login

async function userLoginController(req, res) {

    const { email, password } = req.body;

    const user = await userModel
        .findOne({ email })
        .select("+password");

    if (!user) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        });
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    );

    res.cookie("token", token);

    return res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });
}

    
























module.exports= {
    userRegisterController,

    userLoginController

}

