export const auth = (req,res,next) => {
    if(!req.user) {
        return res.redirect('/')
    }
    next(); 
}

export const authUser = (req,res,next) => {
    if(!req.user) {
        return res.redirect('/')
    }
    if (req.user.role !== "user") {
        return res.status(403).json("Forbidden");
    }
    next(); 
}

export const authAdmin = (req,res,next) => {
    if(!req.user) {
        return res.redirect('/')
    }
    if (req.user.role !== "admin") {
        return res.status(403).json("Forbidden");
    }
    next(); 
}