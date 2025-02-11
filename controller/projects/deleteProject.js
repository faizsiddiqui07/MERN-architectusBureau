const projectModel = require("../../models/project.model");
const cloudinary = require("cloudinary");

const deleteProjectController = async (req, res) => {
    const { project_id } = req.params; 
 
    try {
        const project = await projectModel.findById(project_id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (Array.isArray(project.projectImage)) {
            for (let img of project.projectImage) {
                let public_id = "";

                // If serviceIcon is an object with public_id
                if (typeof img === "object" && img.public_id) {
                    public_id = img.public_id;
                }
                // If serviceIcon is a URL, extract public_id
                else if (typeof img === "string" && img.includes("cloudinary.com")) {
                    const parts = img.split("/");
                    public_id = parts[parts.length - 1].split(".")[0];
                }

                // Delete image from Cloudinary
                if (public_id) {
                    await cloudinary.v2.uploader.destroy(public_id);
                    console.log(`Deleted image: ${public_id}`);
                } else {
                    console.warn("Invalid public_id for image:", img);
                }
            }
        }
        await projectModel.findByIdAndDelete(project_id);

        return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error("Error deleting Project:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

 module.exports = deleteProjectController;