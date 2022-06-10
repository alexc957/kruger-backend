import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import * as express from 'express'
import * as cors from 'cors';
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const app:express.Express = express();
app.use(express.json());
app.use(cors())

app.post("/user",async (req: express.Request, res: express.Response)=> {
    try {
        const email: string =  req.body.email as string  || "";
        const password: string = req.body.password as string || "";
        const userCreated = await admin.auth().createUser({
            email,
            password
        })
        const uid:string = userCreated.uid;
        const name: string = req.body.name as string;

        const cedula: string = req.body.cedula as string;

        await admin.database().ref("users/"+uid).set({
            email,
            name,
            role: "user",
            password,
            uid,
            cedula

        });
        //res.set('Access-Control-Allow-Origin', '*');
        res.json({message: "user created "}).status(200);
    }catch(e){
        res.json({message: "Ocurrio un problema :/ "}).status(500);
    }

});

app.get("/user/:uid",async (req:express.Request, res:express.Response)=> {
    try{
        const uid: string = req.params.uid as string;
        const user =  await admin.database().ref(`users/${uid}`).once("value");
        res.set('Access-Control-Allow-Origin', '*');
        if(!user.exists()){
            return res.send({message: "User not found"}).status(404);
        }
        return res.json(user.val());
    }catch(e){
        return res.json({message: "ocurrio un problema : / "}).status(500);
    }

});

app.get("/employees", async (req: express.Request, res:express.Response)=> {
    try{
        const employees = await admin.database().ref("employees/").once("value");
        if(!employees.exists){
            return res.json({message: "no data to send :/ "}).status(404);
        }
        return res.json(employees.val());
    }catch(e){
        return res.send({message: "ocurrio un problmea :/"}).status(500);
    }
} );

app.get("/employee/:cedula",async (req:express.Request, res: express.Response)=> {
    try{
        const cedula:string = req.params.cedula as string;
        const employeeSnapShot = await admin.database().ref("employees/"+cedula).once("value");
        if(!employeeSnapShot.exists()){
            return res.send({message: "Employee not found"}).status(404);
        }
        return res.json(employeeSnapShot.val());
    }catch(e){
        return res.send({message: "ocurrio un problmea :/"}).status(500);
    }
});

app.post("/employee",async (req:express.Request, res: express.Response)=> {
    try{
        //const cedula:string = req.params.cedula as string;
        const newData = req.body;
        const cedula:string = newData.cedula;
        await admin.database().ref("employees/"+cedula).set(newData);
        return res.send({message: "employee added "})
      
    }catch(e){
        return res.send({message: "ocurrio un problmea :/"}).status(500);
    }
});


app.put("/employee/:cedula",async (req:express.Request, res: express.Response)=> {
    try{
        const cedula:string = req.params.cedula as string;
        const newData = req.body;
        await admin.database().ref("employees/"+cedula).update(newData)
        return res.send({message: "employee updated "})
      
    }catch(e){
        return res.send({message: "ocurrio un problmea :/"}).status(500);
    }
});



export const api = functions.https.onRequest(app);
//export default app;

/*export const createUser = functions.https.onRequest(async (request, response)=> {
    try {
        const email: string =  request.query.email as string  || "";
        const password: string = request.query.password as string || "";
        const userCreated = await admin.auth().createUser({
            email,
            password
        })
        const uid:string = userCreated.uid;
        const name: string = request.query.name as string;

        const cedula: string = request.query.cedula as string;

        await admin.database().ref("users/"+uid).set({
            email,
            name,
            role: "user",
            password,
            uid,
            cedula

        });
        response.set('Access-Control-Allow-Origin', '*');
        response.json({message: "user created "}).status(200);
    }catch(e){
        response.json({message: "Ocurrio un problema :/ "}).status(500);
    }
});
*/
/*export const getUserByUid = functions.https.onRequest(async (req, res)=> {
    try{
        const uid: string = req.query.uid as string;
        const user =  await admin.database().ref(`users/${uid}`).once("value");
        res.set('Access-Control-Allow-Origin', '*');
        res.json(user);
    }catch(e){
        res.json({message: "ocurrio un problema : / "}).status(500);
    }
})
*/

/*export const getEmplyeeByCedula = functions.https.onRequest(async (req,res)=> {
  try{

  }catch(e){

  }
})*/