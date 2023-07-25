import userService from "../services/user.service.js";

export const getUsers = async (req, res) => {
    try {
        const users = await userService.findAll();
        res.status(200).json({status:'success', payload: users});
    } catch (error) {
        res.status(500).json({status:'error', payload: error});
    }
}

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.findById(id);
        res.status(200).json({status:'success', payload: user});
    } catch (error) {
        res.status(500).json({status:'error', payload: error});
    }
}

export const getMockUsers = async (req, res) => {
    try {
        const users = await userService.mockUsers(100);
        console.log(users);
        res.status(200).json({status:'success', payload: users});
    } catch (error) {
        res.status(500).json({status:'error', payload: error});
    }
}