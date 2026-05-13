import { Router } from "express"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const router = Router()

router.post("/login", async(req,res)=>{

    const {email,password} = req.body

    if (email !== process.env.ADMIN_EMAIL) {
        return res.status(401).json({message: "Invalid Credential"})
    }

    const isValid = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH!
  );

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET!,
    { expiresIn: "8h" }
  );

  res.json({ token });
});

export default router;