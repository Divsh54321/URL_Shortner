// why don't put the whole code in app.js? - to make it more readable
// what is express.Router()? - It helps organize routes and makes your code more maintainable by grouping related routes together.
// Benefits of express.Router()
// ✔ Modular Code → Separate route files for better structure
// ✔ Easier Maintenance → Keep routes organized
// ✔ Reusability → Reuse route handlers in different places

import { readFile, writeFile } from "fs/promises";
import crypto from "crypto";
import path from "path";
import { Router } from "express";

const router = Router();
const DATA_FILE = path.join("data", "link.json");

const loadLink = async () => {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    if (!data.trim()) {
      return {};
    }
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }
    throw error;
  }
};

const savelinks = async (link) => {
  await writeFile(DATA_FILE, JSON.stringify(link));
};

router.get("/", async (req, res) => {
  try {
    const file = await readFile(path.join("views", "index.html"));
    // console.log(file);
    const link = await loadLink();
    // console.log(file.toString());

    const content = file.toString().replaceAll(
      "shortened-urls",
      Object.entries(link)
        .map(
          ([shortCode, url]) =>
            `<li><a href ="/${shortCode}" target="_blank">${req.host}/${shortCode}</a> - ${url} </li>`
        )
        .join("")
    );
    return res.send(content);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

// router.get("/report", (req, res) => {
//   res.render("report", { name: "Divye" });
// });

router.post("/", async (req, res) => {
  try {
    const { url, shortCode } = req.body;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");
    const link = await loadLink();

    if (link[finalShortCode]) {
      return res
        .status(400)
        .send("Short Code already existed, please try another");
    }

    link[finalShortCode] = url;

    await savelinks(link);

    return res.redirect("/");
  } catch (error) {}
});

router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const link = await loadLink();

    if (!link[shortCode]) return res.status(404).send("404 Error Found");

    return res.redirect(link[shortCode]);
  } catch (error) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

// default export (isme agr ek se jyda router hue to pta ni lgega kisse call kr rhe h)
// export default router;

// named export (best practice)
export const shortenedRoutes = router;
