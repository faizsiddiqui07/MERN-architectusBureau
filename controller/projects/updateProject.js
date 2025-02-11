const projectModel = require("../../models/project.model");
const cloudinary = require("cloudinary");

const updateProjectController = async (req, res) => {
    try {

        const { _id, projectType, projectImage } = req.body;
        const existProject = await projectModel.findById(_id);

        if (!existProject) {
            return res.status(404).json({ success: false, error: true, message: 'Project not found' });
        }

        const oldImages = existProject.projectImage || [];
        const removedImages = oldImages.filter(img => 
            !projectImage.some(newImg => newImg.public_id === img.public_id)
        );

        for (let img of removedImages) {
            if (img.public_id) {
                await cloudinary.v2.uploader.destroy(img.public_id);
                // console.log(`Deleted image from Cloudinary: ${img.public_id}`);
            }
        }

        existProject.projectType = projectType;
        existProject.projectImage = projectImage;

        await existProject.save();

        res.json({
            message: "Project update successfully",
            data: existProject,
            success: true,
            error: false,
        })

    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

module.exports = updateProjectController