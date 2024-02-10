import express, { response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX!",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You will be provided with a piece of Python code, and your task is to provide ideas for efficiency improvements.",
        },
        {
          role: "user",
          content:
            'from typing import List\n                \n                \n    def has_sum_k(nums: List[int], k: int) -> bool:\n        """\n        Returns True if there are two distinct elements in nums such that their sum \n        is equal to k, and otherwise returns False.\n        """\n        n = len(nums)\n        for i in range(n):\n            for j in range(i+1, n):\n                if nums[i] + nums[j] == k:\n                    return True\n        return False',
        },
      ],
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
    });

    console.log(response.choices[0].text);
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(5000, () =>
  console.log("AI server started on http://localhost:5000")
);
