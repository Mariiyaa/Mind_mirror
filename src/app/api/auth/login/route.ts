import User from "@/src/models/User";
import { connectDB } from "@/src/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";

export async function POST(req: Request) {
try {

    const { email, password } = await req.json();
  await connectDB();
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return Response.json({ token });

    
} catch (error) {
    console.error("Error in login:", error);
    return new Response("Internal Server Error", { status: 500 });
    
}

}
