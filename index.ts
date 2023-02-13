import express, { Express, Request, Response } from "express";
import * as mongoose from 'mongoose';
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./docs/swagger.json";
import User from "./models";
mongoose.connect('mongodb://localhost:27017/node_ts',()=>{
  console.log("connect db")
})
const port = 8000;

const app: Express = express();
app.use(express.json())

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.post("/add-user", async (req: Request, res: Response) => {
 
    try{

    const name: string  = req.body.name;
     const email: string = req.body.email;
     const password: string = req.body.password;
    
    
    let user = new User({
      name,
      email,
      password
    });
  
    const data = await user.save();
   return res.status(200).send({
      success:true,
      data, 
      message:'User added successfully'
    });
    } catch (err) {
      console.log(err);
    }
  
  

});

app.get("/view-user/:id", async (req: Request, res: Response) => {

  try{
    
  
    let user = await User.findOne({_id: req.params.id});
  
    if(!user){
      res.status(200).send({
        success:false,
        data: "", 
        message:'User not found'
      });
    } else {
    res.status(200).send({
      success:true,
      user, 
      message:'User readed successfully'
    })
  }
    } catch (err) {
      console.log(err);
    }
});


app.post("/update-user/:id", async (req: Request, res: Response) => {

  try{
    const name: string  = req.body.name;
  
   
    let user = await User.findOne({_id:req.params.id });
  
    if(!user){
      res.status(200).send({
        success:false,
        data: "", 
        message:'User not found'
      });
    } else {
    let data = await User.findByIdAndUpdate({_id: req.params.id}, {name:name},{new :true});
    res.status(200).send({
      success:true,
      data, 
      message:'User updated successfully'
    })
  }
    } catch (err) {
      console.log(err);
    }
});
app.post("/delete-user/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete({_id: req.params.id});
    if (!user) {
        return res.status(200).send({
          success:false,
          data: "", 
          message:'User not exist'
        });
    } else {
    res.status(200).send({
      success:true,
      user, 
      message:'User deleted successfully'
    })};
  } catch (err) {
    console.log(err)
  }
  

});





app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
