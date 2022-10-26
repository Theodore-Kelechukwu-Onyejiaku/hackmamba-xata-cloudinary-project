import { getXataClient } from "../../utils/xata";
const xata = getXataClient();
import bcrypt from "bcrypt"


export default async function (req, res) {
    console.log("hmmmm")
    try {
        // check if user already exists
        const user = await xata.db.Users.filter("email", req.body.email).getFirst()

        if (user) {
            return res.json({ data: null, error: "User already exists" })
        }

        // generate hash for password
        let saltRounds = 10;
        let hash = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hash
        req.body.provider = "credentials"

        const users = await xata.db.Users.create(req.body);
        console.log(users)
        return res.json({ data: "Registration", error: null })
    } catch (error) {
        console.log(error)
        res.status(500).json({ data: null, error: "something went wrong" })
    }
}