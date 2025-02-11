const express = require("express")
const cloudinary = require("cloudinary");
const authlogin = require('../controller/admin/authlogin')
const uploadProjectController = require("../controller/projects/uploadProjects")
const { getProjectController, getWebsiteProjectController, getSingleProjectController } = require("../controller/projects/getProject")
const deleteProjectController = require("../controller/projects/deleteProject")
const updateProjectStatusController = require("../controller/projects/updateProjectStatus")
const updateProjectController = require("../controller/projects/updateProject")
const getCategoryWiseProjectController = require("../controller/projects/getCategoryWiseProject")
const {subscriberController, getAllSubscribers} = require("../controller/subscribers/subscriber")
const { saveCarrerController, getCarrerController, deleteCarrerController } = require("../controller/carrer/carrer")
const searchProject = require('../controller/projects/searchProject')

const router = express.Router()
const multer = require('multer')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "daf8kxmia",
  api_key: 362161735919762,
  api_secret: 'Nj7WfRS7KlYbD8Dnqi5xYn4WoLE', 
});

// Delete Image Route
router.post("/api/delete-image", async (req, res) => {
  
  try {
    const { public_id } = req.body;
    

    if (!public_id) {
      return res.status(400).json({ error: "Missing public_id" });
    }

    // Delete image from Cloudinary
    const result = await cloudinary.v2.uploader.destroy(public_id);

    if (result.result !== "ok") {
      return res.status(500).json({ error: "Failed to delete image" });
    }

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    // console.error("Cloudinary delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/api/adminLogin', authlogin.login)

//Project Dashboard
router.post('/api/add-project', uploadProjectController)
router.get('/api/get-project', getProjectController)
router.delete('/api/delete-project/:project_id', deleteProjectController)
router.put('/api/updateProjectStatus/:project_id', updateProjectStatusController)
router.get('/api/getCategoryWiseProject/:project_id', getCategoryWiseProjectController)
router.put('/api/updateProject/:project_id', updateProjectController)

// Subscribed
router.post('/api/subscribe', subscriberController)
router.get('/api/getSubscribers',getAllSubscribers)

// for website project
router.get('/api/getProject', getWebsiteProjectController)
router.get('/api/projectDetails/:slug', getSingleProjectController)
// router.post('/api/getRelatedProject', getRelatedProjectController)
router.get('/api/search', searchProject)


// for website carrer
router.post('/api/uploadCarrers', upload.single("resume"), saveCarrerController)
router.get('/api/getCarrer', getCarrerController)
router.delete('/api/delete-carrer/:id', deleteCarrerController)



module.exports = router