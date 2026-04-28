import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./DB/db.js";
import { userMiddleware } from "./MiddleWare/middleWare.js";
import { random } from "./utils.js"
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const JWT_SECRET = process.env.JWT_SECRET;

app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    await UserModel.create({ username, password });
    res.status(200).json({ message: "user created successfully" });
  } catch (error) {
    res.status(400).json({ message: "user not created" });
  }
});


app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await UserModel.findOne({ username, password });
  if (existingUser) {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }
    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(400).json({ massage: "invalid user" });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { title, link, type } = req.body;
  console.log("Received content data:", { title, link, type });  // Log for debugging
try {
   await ContentModel.create({
    title,
    link,
    type,
    //@ts-ignore
    userId: req.userId,
    tag: [],
  });
  res.status(200).json({ message: "content added" });
} catch (error) {
   
    res.status(500).json({ message: "Failed to add content" });
}
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId
  const Content = await ContentModel.find(
    {
      userId: userId
    }
  ).populate('userId', "username")
  res.json({
    Content
  })
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId
  if (!contentId) {
    return res.status(400).json({ message: "contentId is required" })
  }
  const result = await ContentModel.deleteOne({
    _id: contentId,
    // @ts-ignore
    userId: req.userId
  })
  if (result.deletedCount === 0) {
    return res.status(404).json({ message: "Content not found" })
  }
  res.json({
    message: "deleted"
  })
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share
  if (share) {
    const existinglink = await LinkModel.findOne({
       // @ts-ignore
      userId: req.userId
    })
    if (existinglink) {
      res.json({
        hash: existinglink.hash
      })
      return;
    }
    const hash = random(10)
    await LinkModel.create({
      //@ts-ignore
      userId: req.userId,
      hash
    })
    res.json({
      message: "/share/" + hash
    })
  } else {
    await LinkModel.deleteOne({
      //@ts-ignore
      userId: req.userId
    })
    res.json({
      message: "Updated sharable link"
    })
  }
});

app.get("/api/v1/brain/:sharelink", async (req, res) => {
  const hash = req.params.sharelink
  const link = await LinkModel.findOne({
    hash
  })
  if (!link) {
    res.status(411).json({
      message: "Sorry incorrect input"
    })
    return;
  }
  const content = await ContentModel.findOne({
    userId: link.userId
  })
  const user = await UserModel.findOne({
    _id: link.userId
  })

  if (!link) {
    res.status(411).json({
      message: "User not found "
    })
    return;
  }

  res.json({
    username: user?.username,
    content: content

  })
});

app.listen(3000 , () => {console.log("server is running on port 3000")});
