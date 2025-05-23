import { connectDB } from "@/src/lib/mongodb";
import User from "@/src/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
         const reqBody= await req.json();
    const {name, email, password } = reqBody;
  await connectDB();

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  return Response.json({ user });

    } catch (error) {
        console.error("Error in registration:", error);
        return new Response("Internal Server Error", { status: 500 });
        
    }
  
}
