const projectModel = require('../../models/project.model')

const uploadProjectController = async (req, res) => {
    
    try {

        const { projectType } = req.body; 

        if (!req.body) {
            return res.json({
                message: 'All fields are required',
                error: true,
                success: false
            });
        }

        const slug = projectType.split(' ').join('-');

        const uploadProject = new projectModel({
            slug: slug,
            ...req.body,
        }
    )
        const saveProject = await uploadProject.save();

        res.status(201).json({
            message: "Project upload successfull",
            error: false,
            success: true,
            data: saveProject
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error parsing form',
            error: true,
            success: false
        });
    }
};

module.exports = uploadProjectController